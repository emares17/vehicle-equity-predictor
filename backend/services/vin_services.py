import requests
import re

# Available information from NHTSA vin-lookup API that will be used by the model to generate prediction
NHTSA_FIELD_MAPPING = {
    'Make': 'make_name',
    'Model': 'model_name', 
    'Trim': 'trim',
    'Model Year': 'year',
    'Body Class': 'body_type',
    'FuelTypePrimary': 'fuel_type',
    'EngineHP': 'horsepower',
    'EngineCylinders': 'engine_cylinders',  
    'DriveType': 'drive_type',  
    'TransmissionStyle': 'transmission_style'  
}

# Simple VIN validation for backend route using a regex pattern
def validate_vin(vin):
    vin_pattern = r'^[A-HJ-NPR-Z0-9]{17}$'
    return bool(re.match(vin_pattern, vin))

def map_engine_type(engine_cylinders):
    if not engine_cylinders or not engine_cylinders.strip():
        return None
    
    cylinders = engine_cylinders.strip()

    if cylinders.isdigit():
        cylinder_num = int(cylinders)
        prefix = 'i' if cylinder_num <= 4 else 'v'
        return f'{prefix}{cylinder_num}'
    else:
        return cylinders.lower()
    
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
        'fwd': 'front-wheel drive',
        'front-wheel drive': 'front-wheel drive',
        'rwd': 'rear-wheel drive',
        'rear-wheel drive': 'rear-wheel drive'
    }

    return drive_type_mappings.get(drive_type_lower, 'unknown')

def map_transmission_type(transmission_type):
    if not transmission_type or not transmission_type.strip():
        return 'a'
    
    transmission_type_lower = transmission_type.strip().lower()

    if 'cvt' in transmission_type_lower:
        return 'cvt'
    elif 'manual' in transmission_type_lower:
        return 'm'
    else:
        return 'a'

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
        'van': 'van'
    }

    for nhsta_term, model_term in body_type_mappings.items():
        if nhsta_term in body_type_lower:
            return model_term
        
    # fallback 
    return 'sedan'

def extract_vehicle_data(results):
    vehicle_data = {}

    nhtsa_dict = {item['Variable'] : item['Value'] for item in results}

    mappings = {
        'Make' : 'make_name',
        'Model' : 'model_name',
        'Trim' : 'trim'
    }

    for nhtsa_field, model_field in mappings.items():
        value = nhtsa_dict.get(nhtsa_field, '').strip()
        if value:
            vehicle_data[model_field] = value.lower()

    model_year_value = nhtsa_dict.get('Model Year', '').strip()
    if model_year_value:
        # Using a try here instead of if-else due to isdigit() failing in some test cases.
        # try-except block handles this better with graceful fails.
        try:
            vehicle_data['year'] = int(model_year_value)
        except ValueError:
            pass

    horsepower_value = nhtsa_dict.get('EngineHP', '').strip()
    if horsepower_value:
        try:
            vehicle_data['horsepower'] = int(horsepower_value)
        except ValueError:
            pass

    engine_type = map_engine_type(nhtsa_dict.get('EngineCylinders', ''))
    if engine_type:
        vehicle_data['engine_type'] = engine_type

    wheel_system_type = map_engine_type(nhtsa_dict.get('DriveType', ''))
    vehicle_data['wheel_system_display'] = wheel_system_type

    transmission_type = map_engine_type(nhtsa_dict.get('TransmissionStyle', ''))
    vehicle_data['transmission'] = transmission_type

    body_type = map_body_type(nhtsa_dict.get('Body Class', ''))
    vehicle_data['body_type'] = body_type

    return vehicle_data

def decode_vin_number(vin):
    try:
        url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
        response = requests.get(url, timeout = 10)
        response.raise_for_status()

        data = response.json()
        results = data.get('Results', [])
        vehicle_data = extract_vehicle_data(results)

        if vehicle_data.get('make_name') and vehicle_data.get('year'):
            return vehicle_data
        else:
            return None
    
    except requests.RequestException as e:
        print(f'NHTSA API Error: {e}')
        return None