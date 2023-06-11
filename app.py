from package import app

if __name__ == '__main__':
    """
    Entry point of the application.
    """
    app.run(socket=app.config['SERVER_NAME'])
