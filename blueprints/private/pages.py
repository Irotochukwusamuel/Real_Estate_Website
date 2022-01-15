from flask import Blueprint, render_template, request, redirect

import config
from modules.investment import Investment
from modules.referral import Referral
from modules.validations import Validation

Private_page_bp = Blueprint("Private_page_bp", __name__)
validate = Validation()
invest = Investment()
referral = Referral()


@Private_page_bp.route('/dashboard')
@validate.isLoggedIn
@validate.isDisabled
def dashboard():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    user_details = validate.get_userDetails(cookie_id)
    # isAdmin = validate.check_UserIsAdmin(validate.get_Email_withID(cookie_id))
    # pf = validate.get_userProfilePhoto(cookie_id, "profile")
    filters = invest.get_investmentFilters()
    properties = invest.get_AllPropertiesOnLoad(cookie_id)
    return render_template("private/dashboard.html", user_details=user_details, filters=filters, properties=properties)


@Private_page_bp.get('/property/<id>')
def AccessProperty(id):
    if validate.manual_isLoggedIn():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        user_details = validate.get_userDetails(cookie_id)
        property_details = invest.get_propertyWithID(int(id))
        isInvested = invest.check_IsInvested(cookie_id, property_details[0][0])
        return render_template("private/properties.html", user_details=user_details, detail=property_details,
                               isInvested=isInvested)
    else:
        return redirect('/login')


@Private_page_bp.route('/transactions')
@validate.isLoggedIn
@validate.isDisabled
def transactions():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    user_details = validate.get_userDetails(cookie_id)
    # pf = validate.get_userProfilePhoto(cookie_id, "profile")
    # isAdmin = validate.check_UserIsAdmin(validate.get_Email_withID(cookie_id))
    return render_template("private/transactions.html", user_details=user_details)


@Private_page_bp.route('/profile')
@validate.isLoggedIn
@validate.isDisabled
def profile():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    user_details = validate.UserDetails(cookie_id)
    # pf = validate.get_userProfilePhoto(cookie_id, "profile")
    # isAdmin = validate.check_UserIsAdmin(validate.get_Email_withID(cookie_id))
    return render_template("private/profile.html", user_details=user_details)


@Private_page_bp.route('/portfolio')
@validate.isLoggedIn
@validate.isDisabled
def portfolio():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    user_details = validate.UserDetails(cookie_id)
    port = invest.get_UserPortfolio(cookie_id)
    # pf = validate.get_userProfilePhoto(cookie_id, "profile")
    # isAdmin = validate.check_UserIsAdmin(validate.get_Email_withID(cookie_id))
    return render_template("private/portfolio.html", user_details=user_details, port=port)
