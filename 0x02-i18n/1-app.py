#!/usr/bin/env python3
""" Basic babel setup"""
from flask import Flask, render_template
from flask_babel import Babel


class Config:
    """ Represents a flask babel configuration."""
    Languages = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@app.route('/')
def get_index() -> str:
    """ Renders the index.html file."""
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
