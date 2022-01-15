from flask import Blueprint, request

import config
from blueprints.private.settings import setting
from modules.registration import Registration
from modules.validations import Validation

PublicForm_bp = Blueprint("PublicForm_bp", __name__)

register = Registration()
validate = Validation()


def responseData(data):
    return {"data": data}


@PublicForm_bp.post('/CreateAccount')
def CreateAccount():
    fname = config.sanitize_Html(request.form['fname'])
    lname = config.sanitize_Html(request.form['lname'])
    email = config.sanitize_Html(request.form['email'])
    password = config.sanitize_Html(request.form['password'])
    is_investor = request.form["investor"]
    if result := register.registration(email, fname, lname, password, is_investor):
        return result


@PublicForm_bp.post('/Login')
def Login():
    email = config.sanitize_Html(request.form['email'])
    password = config.sanitize_Html(request.form['password'])
    if result := register.login(email, password):
        return result


@PublicForm_bp.post('/forgot-password')
def forgot_password():
    email = config.sanitize_Html(request.form['email'])
    if result := register.forgotPassword(email):
        return result


@PublicForm_bp.post('/change-forgot-password')
def change_forgot_password():
    email = validate.get_cookie_id("verify_email")
    password1 = config.sanitize_Html(request.form['password1'])
    password2 = config.sanitize_Html(request.form['password2'])
    if data := setting.ChangeForgotPassword(email, password1, password2):
        if data == "success":
            return responseData(["success", "Password has been changed successfully, please Sign in again"])
        elif data == "incorrect-password":
            return responseData(["error", "Password does not match"])


@PublicForm_bp.post('/verify-auth')
def verify_auth():
    email = config.sanitize_Html(request.form['email'])
    code = config.sanitize_Html(request.form['verification'])
    if result := register.TwoAuthentificationVerify(email, code):
        return result


@PublicForm_bp.post('/contact-message')
def contact_message():
    name = config.sanitize_Html(request.form['name'])
    email = config.sanitize_Html(request.form['email'])
    subject = config.sanitize_Html(request.form['subject'])
    message = config.sanitize_Html(request.form['message'])
    config.ContactUs(email, subject, message, name)
    return responseData("success")
