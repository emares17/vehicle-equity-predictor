# Main application for the flask server, this script will initialize the app, load environment variables, and register blueprints.
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from config.config import DevelopmentConfig, ProductionConfig

# Load environment variables from .env file
load_dotenv()

def create_app(config_name = 'development'):
    # Creates and configures the Flask application
    app = Flask(__name__)

    config_map = {
        'development': DevelopmentConfig,
        'production': ProductionConfig
    }

    config_class = config_map.get(config_name, DevelopmentConfig)
    app.config.from_object(config_class)

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

app = create_app(os.getenv('FLASK_ENV', 'production'))

if __name__ == '__main__':
    env = os.getenv('FLASK_ENV', 'development')
    app = create_app()

    port_env = os.environ.get('PORT')
    port = int(port_env) if port_env else 5000

    if env == 'production':
        # Production settings
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False
        )
    else:
        app.run(
            host='0.0.0.0',  
            port=port,
            debug=True
        )