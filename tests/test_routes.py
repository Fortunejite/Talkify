import unittest
from flask import url_for
from flask_testing import TestCase

from chat import app, db
from chat.models import User

class ChatTestCase(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        app.config['SERVER_NAME'] = 'localhost'  # Set the SERVER_NAME explicitly
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        app.config['SECRET_KEY'] = '455s555554xs55s'
        return app

    def setUp(self):
        db.create_all()
        # Create a test user
        user = User(username='testuser', password_hash='testpassword', email='test@example.com')
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_index_route_requires_login(self):
        response = self.client.get(url_for('index'))
        self.assertRedirects(response, url_for('login', _external=True))  # Use _external=True to include the full URL

    def test_login_valid_credentials(self):
        response = self.client.post(url_for('login'), data={'username': 'testuser', 'password': 'testpassword'})
        self.assertRedirects(response, url_for('index', _external=True))  # Use _external=True to include the full URL

    def test_logout(self):
        self.client.post(url_for('login'), data={'username': 'testuser', 'password': 'testpassword'})
        response = self.client.post(url_for('logout'))
        self.assertRedirects(response, url_for('login', _external=True))  # Use _external=True to include the full URL

if __name__ == '__main__':
    unittest.main()
