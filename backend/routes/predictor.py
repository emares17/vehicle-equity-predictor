from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime
from database.predictions import insert_prediction, get_prediction_by_id 

# Add root directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.predictor import VehiclePredictor

# Initialize Blueprint
prediction_bp = Blueprint('prediction', __name__)

# Initialize predictor class and load the model from the specified path
predictor = VehiclePredictor()
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'saved', 'vehicle_predictor_model_3m.pkl')

try:
    predictor.load(MODEL_PATH)
except Exception as e:
    predictor = None

# API endpoint to generate predictions, will make use of both predict() and predict_future() methods along with mileage projections.
# This endpoint expects a payload from the frontend including data extracted from the NHTSA API and user inputs.
@prediction_bp.route('/api/predict', methods = ['POST'])
def predict_vehicle_equity():
    try:
        # Perfrom initial check for the model and the request payload.
        if predictor == None:
            return jsonify({
                'error': 'Model not loaded'
            }), 500
        
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided for model'
            }), 400
        
        # Constructing vehicle data from payload data for insertion into database
        vehicle_data = {
            'year': data.get('year'),
            'make_name': data.get('make_name'),
            'model_name': data.get('model_name'),
            'trim_name': data.get('trim_name'),
            'body_type': data.get('body_type'),
            'engine_type': data.get('engine_type'),
            'fuel_type': data.get('fuel_type'),
            'horsepower': data.get('horsepower'),
            'transmission': data.get('transmission'),
            'wheel_system_display': data.get('wheel_system_display'),
        }

        # Constructing user inputs from payload data for insertion into database
        user_inputs = {
            'mileage': data.get('mileage'),
            'dealer_zip': data.get('dealer_zip'),
            'exterior_color': data.get('exterior_color'),
            'interior_color': data.get('interior_color'),
            'exterior_color_base': data.get('exterior_color_base'),
            'interior_color_base': data.get('interior_color_base'),
            'owner_count': data.get('owner_count'),
            'frame_damaged': data.get('frame_damaged'),
            'has_accidents': data.get('has_accidents'),
            'salvage': data.get('salvage'),
            'theft_title': data.get('theft_title'),
            'is_new': data.get('is_new')
        }
        
        # Generate a prediction for the current value of the vehicle.
        current_value = predictor.predict(data) 

        # Calculate future values in the loop below.
        future_values = []
        current_year = datetime.now().year
        # Ensure the vehicle age is at least 1 to avoid division by zero, and calculate annual mileage.
        vehicle_age = max(1, current_year - data['year'])
        current_mileage = data.get('mileage', 0)
        annual_mileage = data['mileage'] / vehicle_age

        # To accurately predict future mileage for new vehicles, this sets a threshold for low mileage and a default annual mileage.
        # if the current annual mileage is less than the threshold, set the annual mileage to the default.
        low_mileage_threshold = 1000
        default_annual_mileage = 12000
        if annual_mileage < low_mileage_threshold:
            annual_mileage = default_annual_mileage

        # Project future values for the next 5 years.
        for year in range(1, 6):
            future_data = data.copy()
            # Update projected mileage for future predictions.
            future_data['mileage'] = current_mileage + (annual_mileage * year)
            # Predict future value using the updated mileage and year.
            future_value = predictor.predict_future(
                future_data, 
                years_ahead = year, 
                annual_mileage = annual_mileage
            )
            # Append to the future values array.
            future_values.append({
                'year': year,
                'value': float(future_value),
                'projected_mileage': annual_mileage
            })

        # Prepare the response to the frontend.
        response = {
            'success': True,
            'data': {
                'current_value': float(current_value),
                'future_values': future_values,
                'annual_mileage': annual_mileage,
                'depreciation_timeline': future_values,
            }
        }
        # Store the prediction in the database and return the prediction ID.
        prediction_id = insert_prediction(
            vin = data.get('vin'),
            vehicle_data = vehicle_data,
            user_inputs = user_inputs,
            prediction_results = response['data']
        )

        response['data']['prediction_id'] = prediction_id

        # Return a success response with the prediction ID for frontend to redirect user to results page at /results/<uuid>.
        return jsonify({
            'success': True,
            'prediction_id': prediction_id
        }), 200
    except KeyError as e:
        return jsonify({
            'error': f'Invalid data: missing {str(e)}'
        }), 400
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'An error occurred during the prediction'
        }), 500
    
# API endpoint to retrieve prediction results by UUID.
# This endpoint will be used by the frontend to fetch and display results on the results page.
# Future updates for this is to add a frontend button to allow users to re-fetch results in case they want to review a previously generated prediction.
@prediction_bp.route('/api/results/<uuid>', methods = ['GET'])
def get_prediction_results(uuid):
    try:
        # Call the database to fetch the prediction results by UUID.
        prediction_results = get_prediction_by_id(uuid)
        # Check if results were found and return the response.
        return jsonify({
            'success': True,
            'data': prediction_results
        }), 200
    except Exception as e:
        return jsonify({ 
            'error':  'An error occurred getting your results.'
        }), 500