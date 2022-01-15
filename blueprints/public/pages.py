from flask import Blueprint, render_template, make_response, redirect

import config
from modules.validations import Validation

public_page_bp = Blueprint("public_page_bp", __name__)
validate = Validation()


@public_page_bp.route('/')
def index():
    return render_template("public/index.html")


@public_page_bp.route('/contact')
def contact():
    return render_template("public/contact.html")


@public_page_bp.route('/services')
def services():
    return render_template("public/services.html")


@public_page_bp.route('/about')
def about():
    return render_template("public/about.html")


@public_page_bp.route('/login')
@validate.Redirect_login
def login():
    return render_template("public/login.html")


@public_page_bp.route('/CreateAccount')
@validate.Redirect_login
def CreateAccount():
    return render_template("public/createaccount.html")


@public_page_bp.route('/forgot-password')
def forgot_password():
    return render_template("public/forgotpassword.html")


@public_page_bp.route('/logout')
def logout():
    res = make_response(redirect("/login"))
    res.set_cookie(config.user_cookie, "", expires=0)
    return res
