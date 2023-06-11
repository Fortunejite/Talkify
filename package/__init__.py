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

app.config['SERVER_NAME'] = 'cryptnex.tech'

socketio = SocketIO(app)

# Initialize the SQLAlchemy extension
db = SQLAlchemy(app)

# Initialize the Bcrypt extension
bcrypt = Bcrypt(app)

# Initialize the LoginManager extension
login_manager = LoginManager(app)

# Import routes and models
from package import routes, models
