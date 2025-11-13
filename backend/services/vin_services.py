import requests
import re
import json

# Service functions to extract data from NHTSA vin-lookup API.
# The NHTSA vin-lookup response contains a lot of information, but it is very inconsistent.
# These functions work to extract the available responses found during testing, but all have to default to values,
# As I don't believe to have covered all edge cases. Due to time constraints, the defaults will have to do for now.
# In the future, this would be a better area to improve as having more accurate vehicle data will improve model predictions.

# Available information from NHTSA vin-lookup API that will be used by the model to generate prediction.
# This dictionary will be used to map the NHTSA fields to the models expected fields.
NHTSA_FIELD_MAPPING = {
    'Make': 'make_name',
    'Model': 'model_name', 
    'Trim': 'trim',
    'Model Year': 'year',
    'Body Class': 'body_type',
    'Fuel Type - Primary': 'fuel_type',
    'Engine Brake (hp) From': 'horsepower',
    'Engine Configuration': 'engine_type',  
    'Drive Type': 'wheel_system_display',  
    'Transmission Style': 'transmission'  
}

# Simple VIN validation for backend route using a regex pattern.
def validate_vin(vin):
    vin_pattern = r'^[A-HJ-NPR-Z0-9]{17}$'
    return bool(re.match(vin_pattern, vin))

# Standardize and map NHTSA fields to 'engine_type' the model expects.
# The NHTSA API doesn't provide a single field of engine type such as "V6" or "I4",
# So these fields have to be formatted for what the model expects based on the data it was trained on.
def map_engine_type(nhtsa_dict): 
    cylinders = nhtsa_dict.get('Engine Number of Cylinders', '')
    config = nhtsa_dict.get('Engine Configuration', '')  

    cylinders = (cylinders or '').strip()
    config = (config or '').strip().lower()

    if cylinders.isdigit():
        cyl_num = int(cylinders)
        prefix = 'v' if 'v' in config else 'i'  
        return f'{prefix}{cyl_num}'
    elif config:
        if 'in-line' in config or 'inline' in config:
            return 'i4'  
        elif 'v' in config:
            return 'v6'  
        else:
            return config
    else:
        return 'unknown'

# Maps various drive types from NHTSA response to model expected values.
# This could be improved in the future with more edge cases handled.
def map_drive_type(drive_type):
    if not drive_type or not drive_type.strip():
        return 'unknown'
    
    drive_type_lower = drive_type.strip().lower()

    drive_type_mappings = {
        'awd': 'all-wheel drive',
        'awd/all-wheel drive': 'all-wheel drive',
        'all-wheel drive': 'all-wheel drive', 
        '4wd': 'four-wheel drive',
        '4x4': 'four-wheel drive',
        '4x2': 'front-wheel drive',
        'fwd': 'front-wheel drive',
        'front-wheel drive': 'front-wheel drive',
        'rwd': 'rear-wheel drive',
        'rear-wheel drive': 'rear-wheel drive'
    }

    return drive_type_mappings.get(drive_type_lower, 'unknown')

# Converts transmission types from NHTSA response to model expected values (a, m, cvt), and defaults to 'a'.
def map_transmission_type(transmission_type):
    if not transmission_type or not transmission_type.strip():
        return 'a'
    
    t = transmission_type.strip().lower()

    if "cvt" in t or "continuously variable" in t:
        return "cvt"
    elif "manual" in t:
        return "m"
    elif "automatic" in t:
        return "a"
    else:
        return "a" 

# Maps various body types from NHTSA to model expected values.
def map_body_type(body_type):
    if not body_type or not body_type.strip():
        return 'sedan'
    
    body_type_lower = body_type.strip().lower()

    body_type_mappings = {
        'sedan': 'sedan',
        'coupe': 'coupe',
        'convertible': 'convertible',
        'suv': 'suv / crossover',
        'sport utility vehicle': 'suv / crossover',
        'multipurpose passenger vehicle': 'suv / crossover',
        'pickup': 'pickup truck',
        'truck': 'pickup truck',
        'wagon': 'wagon',
        'hatchback': 'hatchback',
        'van': 'van',
        'Hatchback/Liftback/Notchback': 'hatchback'
    }

    for nhsta_term, model_term in body_type_mappings.items():
        if nhsta_term in body_type_lower:
            return model_term
        
    # fallback 
    return 'sedan'

# Extracts, cleans, and maps raw vehicle data from NHTSA vin-lookup API response.
def extract_vehicle_data(results):
    vehicle_data = {}

    # Convert list of dicts to a single dict for easier access
    nhtsa_dict = {item['Variable'] : item['Value'] for item in results}

    # Map and clean fields based on NHTSA_FIELD_MAPPING
    for nhtsa_field, model_field in NHTSA_FIELD_MAPPING.items():
        value = nhtsa_dict.get(nhtsa_field, '')
        if value and isinstance(value, str):
            value = value.strip()
        if value:
            # Convert specific fields to int
            if model_field == 'year':
                try:
                    value = int(value)
                except ValueError:
                    continue
            elif model_field == 'horsepower':
                try:
                    value = int(value)
                except ValueError:
                    continue
            vehicle_data[model_field] = value

    # Additional processing for specific fields mainly using the above mapping functions
    horsepower_value = nhtsa_dict.get('Engine Brake (hp) From', '')
    if horsepower_value and isinstance(horsepower_value, str):
        if horsepower_value:    
            try:
                vehicle_data['horsepower'] = int(horsepower_value)
            except ValueError:
                pass

    engine_type = map_engine_type(nhtsa_dict)
    if engine_type:
        vehicle_data['engine_type'] = engine_type

    wheel_system_type = map_drive_type(nhtsa_dict.get('Drive Type', ''))
    vehicle_data['wheel_system_display'] = wheel_system_type

    transmission_type = map_transmission_type(nhtsa_dict.get('Transmission Style', ''))
    vehicle_data['transmission'] = transmission_type

    body_type = map_body_type(nhtsa_dict.get('Body Class', ''))
    vehicle_data['body_type'] = body_type

    return vehicle_data

# used in /api/vin-lookup route to decode a VIN number using the NHTSA API.
def decode_vin_number(vin):
    # Decoded the VIN number by calling the NHTSA API and processing the response.
    # Returns a dictionary of vehicle data if able to decode, else returns None.
    try:
        # Construct the URL to NHTSA vin-lookup endpoint
        url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
        # Make the GET request to the NHTSA API with a timeout
        response = requests.get(url, timeout = 10)
        # Raise an error for bad responses, uses .raise_for_status() to catch bad responses and eliminate need to check status code manually.
        response.raise_for_status()
        # Extract the JSON data from the response and process it
        data = response.json()
        results = data.get('Results', [])
        vehicle_data = extract_vehicle_data(results)

        # Perform a final validation to ensure essential fields are found.
        if vehicle_data.get('make_name') and vehicle_data.get('year'):
            return vehicle_data
        else:
            return None
    
    except requests.RequestException as e:
        # Handle and print any request exceptions
        print(f'NHTSA API Error: {e}')
        return None