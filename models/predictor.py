import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class VehiclePredictor:
    def __init__(self):
        self.model = None
        self.encoders = {}
        self.feature_cols = []

    def load_data(self, filepath):
        df = pd.read_csv(filepath)
        return df
    
    def prepare_features(self, df):
        df = df.copy()

        df['vehicle_age'] = datetime.now().year - df['year']
        df['mileage_per_year'] = df['mileage'] / (df['vehicle_age'] + 1)
        
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
        ]

        for col in numeric_features:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].median())

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
            'city',
            'engine_type',
            'fuel_type',
            # 'listed_date', # Date feature, needs special handling
        ]

        for col in categorical_features:
            if col in df.columns:
                df[col] = df[col].fillna('Unknown')
        
        df['is_one_owner'] = (df['owner_count'] == 1).astype(int)
        df['frame_damaged'] = df['frame_damaged'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['has_accidents'] = df['has_accidents'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['is_new'] = df['is_new'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['salvage'] = df['salvage'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)
        df['theft_title'] = df['theft_title'].map({'TRUE': 1, 'FALSE': 0}).fillna(0)

        feature_cols = (
            numeric_features +
            categorical_features +
            ['is_one_owner', 'frame_damaged', 'has_accidents', 'is_new', 'salvage', 'theft_title']
        )

        X = df[feature_cols]
        y = df['price'] if 'price' in df.columns else None

        return X, y
    
    def encode_categorical(self, X, fit=True):
        X_encoded = X.copy()

        categorical_cols = X.select_dtypes(include=['object']).columns

        for col in categorical_cols:
            if fit:
                label_encoder = LabelEncoder()
                X_encoded[col] = label_encoder.fit_transform(X[col])
                self.encoders[col] = label_encoder
            else:
                label_encoder = self.encoders[col]
                X_encoded[col] = label_encoder.transform(X[col])

        return X_encoded

    def train(self, df):
        X, y = self.prepare_features(df)

        self.feature_cols = X.columns.tolist()

        X = self.encode_categorical(X, fit=True)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)

        regr = RandomForestRegressor(
            n_estimators=150, 
            max_depth=25, 
            min_samples_split=10, 
            min_samples_leaf=4,
            max_features=0.3,
            random_state=42,
            n_jobs=-1
        ) 

        regr.fit(X_train, y_train)
        self.model = regr

        y_pred = regr.predict(X_test)

        # Evaluation metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        print(f'MAE: ${mae:,.2f}, RMSE: ${rmse:,.2f}, R2: {r2:.3f}')


    def predict(self, vehicle_details):
        if self.model is None:
            raise Exception("Model not trained or loaded.")

        df = pd.DataFrame([vehicle_details])
        X, _ = self.prepare_features(df)
        X = self.encode_categorical(X, fit=False)

        prediction = self.model.predict(X)
        return prediction[0]

    def predict_future(self, vehicle_details, years_ahead, annual_mileage):
        if self.model is None:
            raise Exception("Model not trained or loaded.")
        
        future_details = vehicle_details.copy()

        future_details['year'] = future_details['year'] - years_ahead
        future_details['mileage'] = future_details['mileage'] + (annual_mileage * years_ahead)

        return self.predict(future_details)

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
