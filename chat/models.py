"""
models.py
==============================
This module defines the database models for the chat application.

"""

from chat import db, login_manager, bcrypt
from flask_login import UserMixin
import json

@login_manager.user_loader
def load_user(user_id):
    """
    A callback function that loads a user by their ID.

    Parameters:
    - user_id (int): The ID of the user.

    Returns:
    - user (User): The user object.

    """
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    """
    Represents a user in the chat application.

    Attributes:
    - id (int): The unique identifier of the user.
    - username (str): The username of the user.
    - email (str): The email address of the user.
    - password_hash (str): The hashed password of the user.
    - posts (relationship): The posts created by the user.

    Methods:
    - __repr__(): Returns a string representation of the user object.
    - set_password(password): Sets the password for the user.
    - check_password(password): Checks if the provided password matches the user's password.
    - save(): Saves the user object to the database.

    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    friends = db.Column(db.JSON, default='[]')
    messages = db.Column(db.JSON, default='{}')
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
        """
        Returns a string representation of the user object.

        Returns:
        - str: The string representation of the user.

        """
        return f'<User {self.username}>'

    def set_password(self, password):
        """
        Sets the password for the user.

        Parameters:
        - password (str): The password to set.

        """
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """
        Checks if the provided password matches the user's password.

        Parameters:
        - password (str): The password to check.

        Returns:
        - bool: True if the passwords match, False otherwise.

        """
        return bcrypt.check_password_hash(self.password_hash, password)

    def save(self):
        """
        Saves the user object to the database.

        """
        db.session.add(self)
        db.session.commit()

    def get_friends(self):
        if self.friends == "":
            return None
        else:
            friends = json.loads(self.friends)
            if friends:
                return friends
            else:
                return None
            
    def add_friend(self, name):
        if self.friends == "[]":
            friend = []
            friend.append(name)
            self.friends = json.dumps(friend)
            messages = json.loads(self.messages)
            messages[name] = []
            self.messages = json.dumps(messages)
        else:
            friends = json.loads(self.friends)
            friends.append(name)
            self.friends = json.dumps(friends)
            messages = json.loads(self.messages)
            messages[name] = []
            self.messages = json.dumps(messages)

        db.session.add(self)
        db.session.commit()
        print('Success')


    def get_messages(self, name):
        messages = json.loads(self.messages)
        messages = messages[name]
        return messages
    
    def save_message(self, name, message):
        messages = json.loads(self.messages)
        messages[name].append(message)
        self.messages = json.dumps(messages)
        db.session.add(self)
        db.session.commit()

class Post(db.Model):
    """
    Represents a post in the chat application.

    Attributes:
    - id (int): The unique identifier of the post.
    - sender (int): The ID of the user who sent the post.
    - body (str): The content of the post.

    Methods:
    - __repr__(): Returns a string representation of the post object.
    - get_sender_username(): Retrieves the username of the post sender.

    """

    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    body = db.Column(db.String(1024), nullable=False)

    def __repr__(self):
        """
        Returns a string representation of the post object.

        Returns:
        - str: The string representation of the post.

        """
        return f'<Post {self.id}>'

    def get_sender_username(self):
        """
        Retrieves the username of the post sender.

        Returns:
        - str or None: The username of the sender if found, None otherwise.

        """
        sender = User.query.get(self.sender)
        if sender:
            return sender.username
        else:
            return None
        

class message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(1024), nullable=False)
    time = db.Column(db.String(30), nullable=False)