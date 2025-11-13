# Main application for the flask server, this script will initialize the app, load environment variables, and register blueprints.
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def create_app():
    # Creates and configures the Flask application
    app = Flask(__name__)
    # Enable CORS to allow requests from the frontend
    CORS(app)

    # App configs
    app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true'

    # Supabase Config
    app.config['SUPABASE_URL'] = os.getenv('SUPABASE_URL')
    app.config['SUPABASE_KEY'] = os.getenv('SUPABASE_KEY')

    # Initialize the database
    from database.database import init_database
    init_database(app)

    # Import and register Blueprints
    from routes.vin import vin_bp
    from routes.predictor import prediction_bp

    app.register_blueprint(vin_bp)
    app.register_blueprint(prediction_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug = True, port = 5000)