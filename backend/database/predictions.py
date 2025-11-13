from database.database import get_supabase
import uuid

# Service functions to interact with the 'predictions' table in Supabase
# This functions will act as helpers in the routes to insert and fetch prediction records from the db.

def insert_prediction(vin, vehicle_data, user_inputs, prediction_results):
    # Inserts a new prediction into the 'predictions' table

    # Get the Supabase client instance
    supabase = get_supabase()

    # Create a new prediction record into a dictionary
    prediction = {
        'vin': vin,
        'vehicle_data': vehicle_data,
        'user_inputs': user_inputs,
        'prediction_results': prediction_results
    }

    # Execute the prediction insert into the 'predictions' table
    response = supabase.table('predictions').insert(prediction).execute()

    # Return the UUID of the newly inserted prediction to return to the frontend,
    # The frontend will then use this UUID to redirect the user to their results at /results/<uuid>.
    return response.data[0]['id']


def get_prediction_by_id(uuid):
    # Fetches a prediction record by its UUID from the 'predictions' table

    # Get the Supabase client instance
    supabase = get_supabase()

    # Query the 'predictions' table for the record with the given UUID
    response = supabase.table('predictions').select('*').eq('id', uuid).execute()

    # If a record existrs, return it or else return None
    if response.data:
        return response.data[0]
    
    return None