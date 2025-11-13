import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime
from dateutil.relativedelta import relativedelta
import warnings
warnings.filterwarnings('ignore')

# VehiclePredictor class used for the model training, prediction, and saving/loading functionalities.
# The predict and predict_future methods will later be used in the API endpoint /api/predict to generate the final predictions.
class VehiclePredictor:
    def __init__(self):
        self.model = None
        self.encoders = {}
        self.feature_cols = []

    def load_data(self, filepath):
        df = pd.read_csv(filepath)
        return df
    
    def prepare_features(self, df):
        # Creating a copy to avoid modifying the original dataframe and triggering SettingWithCopyWarning.
        df = df.copy()

        # Time based feature using the listing_date column in the dataset
        # Converting listing_date from string to datetime
        # This is intended to capture seasonal trends in vehicle pricing
        df['listed_date'] = pd.to_datetime(df['listed_date'], format='%m/%d/%Y', errors='coerce')
        df['listed_year'] = df['listed_date'].dt.year
        df['listed_month'] = df['listed_date'].dt.month

        # Feature engineering for vehicle age and mileage per year
        df['vehicle_age'] = (df['listed_year'] - df['year']).clip(lower = 0)
        df['mileage_per_year'] = df['mileage'] / (df['vehicle_age'] + 1)

        # Handling missing values and feature engineering for regional location using zip code.
        # Originally, this was attempted using 'City', but the encoding used below was not effective,
        # The use of one-hot encoding also proved to be inefficient and saw a large drop in performance metrics.
        # Ultimately, I decided to use the first three digits of the zip code as a new feature 'zip_prefix' and cover the regional feature.
        # This led to better performance and only some small changes needed to the frontend for the user to input zip instead of city.
        if 'dealer_zip' in df.columns:
            df['dealer_zip'] = df['dealer_zip'].fillna('00000').astype(str).str.replace('.0', '', regex=False)
            df['zip_prefix'] = df['dealer_zip'].str[:3]

        # Numeric features for model and handling missing values using median imputation
        numeric_features = [
            'year',
            'mileage',
            'horsepower', 
            'torque',
            'vehicle_age',
            'mileage_per_year',
            'city_fuel_economy',
            'highway_fuel_economy',
            'combine_fuel_economy',
            'owner_count',
            'daysonmarket',
            'listed_year', # New feature added
            'listed_month', # New feature added
        ]

        for col in numeric_features:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].median()) # Median imputation for numeric features

        # Categorical features for model and handling missing values using 'unknown'
        categorical_features = [
            'make_name',
            'model_name',
            'trim_name',
            'exterior_color',
            'interior_color',
            'exterior_color_base',
            'interior_color_base',
            'transmission',
            'body_type',
            'wheel_system_display',
            'engine_type',
            'fuel_type',
            'zip_prefix'  # New feature added
        ]

        for col in categorical_features:
            if col in df.columns:
                df[col] = df[col].fillna('unknown') # 'unknown' for categorical features
        
        # Binary features mapping TRUE/FALSE to 1/0 and handling missing values using 0
        df['is_one_owner'] = (df['owner_count'] == 1).astype(int)
        df['frame_damaged'] = df['frame_damaged'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['has_accidents'] = df['has_accidents'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['is_new'] = df['is_new'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['salvage'] = df['salvage'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['theft_title'] = df['theft_title'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)

        # Final feature matrix and target variable
        feature_cols = (
            numeric_features +
            categorical_features +
            ['is_one_owner', 'frame_damaged', 'has_accidents', 'is_new', 'salvage', 'theft_title']
        )

        X = df[feature_cols]
        y = df['price'] if 'price' in df.columns else None

        return X, y
    
    # Encoding categorical features using Label Encoding
    # This method will operate in two different modes: fit = True (for training) and fit = False (for prediction).
    # When fit = True, it fits the LabelEncoder to the training data and stores the encoders.
    # When fit = False, it uses the stored encoders to transform new data, safely handling unseen categories.
    def encode_categorical(self, X, fit=True):
        # Copy to avoid modifying original dataframe
        X_encoded = X.copy()

        # Identify categorical columns with string/object types
        categorical_cols = X.select_dtypes(include=['object']).columns

        for col in categorical_cols:
            # Fit and save new encoders if fit=True, only used during training.
            if fit:
                label_encoder = LabelEncoder()
                X_encoded[col] = label_encoder.fit_transform(X[col])
                self.encoders[col] = label_encoder
            # During prediction (fit=False), use existing encoders and handle unseen categories.
            else:
                label_encoder = self.encoders[col]
                # Function to safely handle unseen categories that will transform to 'unknown' if available, and as a last resort to 0.
                # This function was later added in the development due to issue handling response data from the NHTSA API.
                # The NHTSA API data was very inconsistent, and attempting to extract data from it became very difficult,
                # I opted to add this safe handling function to ensure the model would not break when encountering unseen categories.
                def safe_transform(val):
                    if val in label_encoder.classes_:
                        return label_encoder.transform([val])[0]
                    else:
                        if 'unknown' in label_encoder.classes_:
                            return label_encoder.transform(['unknown'])[0]
                        return 0  
                X_encoded[col] = X[col].apply(safe_transform)

        return X_encoded

    def train(self, df):
        # Main function to train the model.
        # This function sets up the data by encoding features, and using a train-test split.
        # It also initializes the RandomForestRegressor with hyperparameters found using RandomizedSearchCV,
        # then fits the model to the training data and evaluates its peformance. 
        X, y = self.prepare_features(df)

        self.feature_cols = X.columns.tolist()

        X = self.encode_categorical(X, fit=True)

        # Splits data into training and testing sets (80% train, 20% test)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)

        # Hyperparameter tuning:
        # The optimal parameters were found using RandomizedSearchCV on initial runs,
        # as tuning with multiple parameter combinations was time and space consuming.
        # I set up a parameters dictionary with the ranges I wanted to try for each hyperparameter, and 
        # used RandomizedSearchCV to search through the combinations of these parameters.
        # The best parameters were then used to train the final model below.
        regr = RandomForestRegressor(
            n_estimators=150, 
            max_depth=25, 
            min_samples_split=10, 
            min_samples_leaf=4, 
            max_features=0.3,
            random_state=42,
            n_jobs=-1
        ) 

        # Train the model on the training data
        regr.fit(X_train, y_train)
        self.model = regr

        # Evaluate the model on the test data
        y_pred = regr.predict(X_test)

        # Evaluation metrics 
        # The project goals specified r2 >= 0.78, RMSE <= $10,000, MAE <= $2,000.
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        print(f'MAE: ${mae:,.2f}, RMSE: ${rmse:,.2f}, R2: {r2:.3f}')


    def predict(self, vehicle_details):
        # This function used the trained model to predict the current value of a single vehicle.
        # It takes a dictionary of vehicle details as input, prepares the features, encodes them,
        # and then uses the model to generate a price prediction.

        # Check if model is trained, as this function will be used in the API endpoint /api/predict
        if self.model is None:
            raise Exception("Model not trained or loaded.")

        # Convert input dictionary to DataFrame
        df = pd.DataFrame([vehicle_details])

        # Added for current listing_date changes
        # In the instance a user does not provide a listing date, this will default to the current date.
        if 'listed_date' not in df.columns:
            df['listed_date'] = datetime.now().strftime('%m/%d/%Y')

        # Use the same feature preparation and encoding as during training
        X, _ = self.prepare_features(df)
        X = self.encode_categorical(X, fit=False)

        # Generate and return prediction
        prediction = self.model.predict(X)
        return prediction[0]

    def predict_future(self, vehicle_details, years_ahead, annual_mileage):
        # This function predicts the future value of a vehicle after a specified number of years.
        # This function will wrap around the predict function, adjusting the vehicle's age and mileage
        
        # Check if model is trained
        if self.model is None:
            raise Exception("Model not trained or loaded.")
        
        # Create a copy of vehicle_details to avoid modifying the original data
        future_details = vehicle_details.copy()

        # Added for feature engineering changes
        # This sets the 'listed_date' to a future date by adding a specific number of years using relativedelta.
        future_date = datetime.now() + relativedelta(years=years_ahead)
        future_details['listed_date'] = future_date.strftime('%m/%d/%Y')

        # Call the predict method using the updated future data.
        return self.predict(future_details)

    # Save model along with encoders and feature columns
    def save(self, filepath):
        if self.model is None:
            raise Exception("Model not trained.")
        
        model_data = {
            'model': self.model,
            'encoders': self.encoders,
            'feature_cols': self.feature_cols
        }

        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)

        print(f'Model saved to {filepath}')

    def load(self, filepath):
        if not os.path.exists(filepath):
            raise Exception(f"File {filepath} does not exist.")
        
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
            self.model = model_data['model']
            self.encoders = model_data['encoders']
            self.feature_cols = model_data['feature_cols']
        
        print(f'Model loaded from {filepath}')
