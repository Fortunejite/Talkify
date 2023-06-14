"""
app.py
==============================
This module initializes a Flask application and sets up the required extensions and configurations.

"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_socketio import SocketIO

# Initialize the Flask application
app = Flask(__name__)

# Configure the SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'

# Set the secret key for the application
app.config['SECRET_KEY'] = '8b4275a6deafd1066910155f'

# Set the server name for the application
app.config['SERVER_NAME'] = 'cryptnex.tech'

# Initialize the SocketIO extension with the Flask application
socketio = SocketIO(app, async_mode='gevent')

# Initialize the SQLAlchemy extension with the Flask application
db = SQLAlchemy(app)

# Initialize the Bcrypt extension with the Flask application
bcrypt = Bcrypt(app)

# Initialize the LoginManager extension with the Flask application
login_manager = LoginManager(app)

# Import routes and models after initializing extensions
from package import routes, models
