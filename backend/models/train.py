from predictor import VehiclePredictor

# Script to train and save the model
# Create an instance of VehiclePredictor, load data, train the model, and saves the trained model.
def main():
    # Create instance
    predictor = VehiclePredictor()

    # Load cleaned data
    df = predictor.load_data('../data/processed/used_cars_data_cleaned.csv')

    # Train model
    predictor.train(df)

    # Save trained model
    predictor.save('models/saved/vehicle_predictor_model_3m.pkl')


if __name__ == "__main__":
    main()