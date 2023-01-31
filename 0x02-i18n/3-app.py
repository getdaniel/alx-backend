#!/usr/bin/env python3
""" Basic Flask App"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """ Represents a flask babel configuration."""
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@app.route('/')
def get_index() -> str:
    """ Renders the index.html file."""
    return render_template('3-index.html')


@babel.localeselector
def get_locale() -> str:
    """ Get locale from request."""
    return request.accept_languages.best_match(app.config["LANGUAGES"])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
