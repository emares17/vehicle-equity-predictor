from supabase import create_client, Client

# Manages the Supabase client instance

# Global variable to hold the Supabase client
supabase = None

def init_database(app):
    # Initialize the Supabase client with app configuration

    global supabase

    # The app context is needed to access app.config
    with app.app_context():
        supabase = create_client(
            app.config['SUPABASE_URL'],
            app.config['SUPABASE_KEY']
        )

def get_supabase():
    # returns the instance of the Supabase client
    return supabase