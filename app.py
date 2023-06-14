# Import necessary modules and functions
from gevent import monkey
monkey.patch_all()
from package import app, socketio

if __name__ == '__main__':
    """
    Entry point of the application.
    """
    # Run the application using Socket.IO
    socketio.run(app, host='0.0.0.0', port=8000)
