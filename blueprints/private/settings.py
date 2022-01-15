from flask import Blueprint, request

import config
from modules.investment import Investment
from modules.models import Model
from modules.referral import Referral
from modules.settings import Setting
from modules.validations import Validation

Settings_page_bp = Blueprint("Settings_page_bp", __name__)
validate = Validation()
invest = Investment()
referral = Referral()
setting = Setting()
model = Model()


def responseData(data):
    return {"data": data}


@Settings_page_bp.post("/profilephoto")
@validate.isLoggedIn
def profilephoto():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        if setting.validate_photo(cookie_id, data["pf"], "profile"):
            return responseData(["success", "Photo changed successfully"])


@Settings_page_bp.post("/kin-photo")
@validate.isLoggedIn
def kin_photo():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        if setting.validate_photo(cookie_id, data["pf"], "kin"):
            return responseData(["success", "Photo changed successfully"])


@Settings_page_bp.post("/changepassword")
@validate.isLoggedIn
def changepassword():
    email = validate.get_Email_withCookie(validate.get_cookie_id(config.user_cookie))
    password = config.sanitize_Html(request.form["current"])
    newpass = config.sanitize_Html(request.form["new"])

    if data := setting.Changepassword(email, password, newpass):
        if data == "password-exist":
            return responseData(["warning", "New password still exist"])
        elif data == "success":
            return responseData(["success", "Password has been changed successfully"])
        elif data == "incorrect-password":
            return responseData(["warning", "Incorrect old password"])


@Settings_page_bp.post("/changeemail")
@validate.isLoggedIn
def changeemail():
    cookie = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    email = config.sanitize_Html(request.form["email"])

    if data := setting.Changeemail(cookie, email):
        if data == "email-exist":
            return responseData(["error", "Email already exist!"])
        elif data == "success":
            return responseData(["success", "Email has been changed successfully, please Sign in again"])


@Settings_page_bp.post('/update-bio')
@validate.isLoggedIn
def update_bio():
    fname = config.sanitize_Html(request.form['firstname'])
    lname = config.sanitize_Html(request.form['lastname'])
    phone = config.sanitize_Html(request.form['phone'])
    gender = config.sanitize_Html(request.form['gender'])
    wallet = config.sanitize_Html(request.form['ssn'])
    ContactAddress = config.sanitize_Html(request.form['contact'])
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    if data := setting.UpdateBio(cookie_id, fname, lname, gender, wallet, ContactAddress, phone):
        if data == "success":
            return responseData("success")


@Settings_page_bp.post('/update-kin')
@validate.isLoggedIn
def update_kin():
    name = config.sanitize_Html(request.form['name'])
    email = config.sanitize_Html(request.form['email'])
    relationship = config.sanitize_Html(request.form['relationship'])
    phone = config.sanitize_Html(request.form['phone'])
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    if data := setting.UpdateKin(cookie_id, name, email, relationship, phone):
        if data == "success":
            return responseData("success")
