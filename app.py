from package import app, socketio

if __name__ == '__main__':
    """
    Entry point of the application.
    """
    socketio.run(app, host='127.0.0.1', port=8000)

