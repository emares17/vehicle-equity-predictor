from flask import Blueprint, request, jsonify
from services.vin_services import decode_vin_number, validate_vin

vin_bp = Blueprint('vin', __name__)

@vin_bp.route('/api/vin-lookup', methods=['POST'])
def vin_lookup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided.'
            }), 400
        
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
        
        vehicle_data = decode_vin_number(vin)

        if not vehicle_data:
            return jsonify({
                'error': 'VIN number not found or invalid, please check and try again.'
            }), 404
        
        return jsonify({
            'success': True,
            'data': vehicle_data
        })
    
    except Exception as e:
        return jsonify({
            'error': 'An error occurred during VIN number lookup, please try again.'
        })