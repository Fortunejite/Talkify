# models.py

from package import db, login_manager, bcrypt
from flask_login import UserMixin
from datetime import datetime
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
    user = User.query.get(int(user_id))
    if user:
        return user
    return None

class User(db.Model, UserMixin):
    """
    Represents a user in the chat application.

    Attributes:
    - id (int): The unique identifier of the user.
    - username (str): The username of the user.
    - email (str): The email address of the user.
    - password_hash (str): The hashed password of the user.
    - avatar (bytes): The avatar (profile picture) of the user.
    - friends (list): The list of user's friends.
    - friend_requests_sent (list): The list of friend requests sent by the user.
    - pending_friend_requests (list): The list of pending friend requests received by the user.
    - notifications (list): The list of user's notifications.
    - messages (dict): The dictionary storing user's chat messages with other users.
    - posts (relationship): The posts created by the user.
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    avatar = db.Column(db.LargeBinary)
    friends = db.Column(db.JSON, default=list)
    friend_requests_sent = db.Column(db.JSON, default=list)
    pending_friend_requests = db.Column(db.JSON, default=list)
    notifications = db.Column(db.JSON, default=list)
    messages = db.Column(db.JSON, default=dict)
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
        if not self.friends:
            return None
        else:
            return json.loads(self.friends)

    def get_pending_friend_requests(self):
        if not self.pending_friend_requests:
            return None
        else:
            return json.loads(self.pending_friend_requests)

    def add_friend(self, friend_username):
        if not self.friends:
            self.friends = json.dumps([friend_username])
            self.messages = json.dumps({friend_username: []})
        else:
            friends = json.loads(self.friends)
            friends.append(friend_username)
            self.friends = json.dumps(friends)
            messages = json.loads(self.messages)
            messages[friend_username] = []
            self.messages = json.dumps(messages)

        self.save()

    def send_friend_request(self, friend_username):
        friend = User.query.filter_by(username=friend_username).first()
        requests = json.loads(friend.friend_requests_sent)
        requests.append(self.username)
        friend.friend_requests_sent = json.dumps(requests)
        pending = self.get_pending_friend_requests()
        pending.append(friend_username)
        self.pending_friend_requests = json.dumps(pending)
        notif = json.loads(friend.notifications)
        notif.append({
            'category': 'Request',
            'id': self.id,
            'message': f'{self.username} sent you a friend request',
            'time': datetime.now().strftime('%H:%M:%S')
        })
        friend.notifications = json.dumps(notif)
        friend.save()
        self.save()

    def accept_friend_request(self, friend_username):
        self.add_friend(friend_username)
        friend = User.query.filter_by(username=friend_username).first()
        friend.add_friend(self.username)
        self.friend_requests_sent.remove(friend_username)
        friend.pending_friend_requests.remove(self.username)
        self.notifications.append({
            'category': 'Accept',
            'message': f'{self.username} accepted your friend request',
            'time': datetime.now().strftime('%H:%M:%S')
        })
        self.save()
        friend.save()

    def reject_friend_request(self, friend_username):
        friend = User.query.filter_by(username=friend_username).first()
        self.friend_requests_sent.remove(friend_username)
        self.notifications.append({
            'category': 'Reject',
            'message': f'{self.username} rejected your friend request',
            'time': datetime.now().strftime('%H:%M:%S')
        })
        self.save()
        friend.save()

    def get_chat_messages(self, friend_username):
        messages = json.loads(self.messages)
        return messages.get(friend_username, [])

    def save_chat_message(self, friend_username, message):
        messages = json.loads(self.messages)
        messages[friend_username].append(message)
        self.messages = json.dumps(messages)
        friend = User.query.filter_by(username=friend_username).first()
        friend.messages[self.username].append(message)
        friend.save()
        self.save()

    def get_notifications(self):
        return self.notifications


class Post(db.Model):
    """
    Represents a post in the chat application.

    Attributes:
    - id (int): The unique identifier of the post.
    - sender_id (int): The ID of the user who sent the post.
    - body (str): The content of the post.

    Methods:
    - __repr__(): Returns a string representation of the post object.
    - get_sender_username(): Retrieves the username of the post sender.
    """

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
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
        sender = User.query.get(self.sender_id)
        if sender:
            return sender.username
        else:
            return None
