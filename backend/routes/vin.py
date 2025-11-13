from flask import Blueprint, request, jsonify
from services.vin_services import decode_vin_number, validate_vin

# Flask Blueprint for VIN-related routes
vin_bp = Blueprint('vin', __name__)

# API endpoint to validate and decode VIN number lookups requested by users.
@vin_bp.route('/api/vin-lookup', methods=['POST'])
def vin_lookup():
    try:
        # Get and validate the JSON data from the request
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided.'
            }), 400
        # Extract and clean the VIN number then performs a series of validations
        vin = data.get('vin', '').strip().upper()
        if not vin:
            return jsonify({
                'error': 'No VIN number provided.'
            }), 400

        if len(vin) != 17:
            return jsonify({
                'error': 'VIN number must be 17 characters.'
            }), 400 
        
        if not validate_vin(vin):
            return jsonify({
                'error': 'Invalid VIN number format.'
            }), 400
        
        # If data passes all validations, decode the VIN number.
        vehicle_data = decode_vin_number(vin)

        # Addidtional check to ensure vehicle data was found
        if not vehicle_data:
            return jsonify({
                'error': 'VIN number not found or invalid, please check and try again.'
            }), 404
        
        # Return the decoded vehicle data to the frontend
        return jsonify({
            'success': True,
            'data': vehicle_data
        }), 200
    
    except Exception as e:
        # Error handling for unexpected exceptions
        print(f"Exception in vin_lookup: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': 'An error occurred during VIN number lookup, please try again.'
        }), 500