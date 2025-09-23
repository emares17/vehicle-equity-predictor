from predictor import VehiclePredictor
import pandas as pd

def main():
    # Create instance
    predictor = VehiclePredictor()

    # Load cleaned data
    df = predictor.load_data('data/processed/used_cars_data_cleaned.csv')

    # Train model
    predictor.train(df)

    # Save trained model
    predictor.save('models/saved/vehicle_predictor_model_3m_v2.pkl')


if __name__ == "__main__":
    main()