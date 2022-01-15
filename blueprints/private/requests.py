import json

from flask import Blueprint, request, render_template

import config
from blueprints.public.form import register
from modules.investment import Investment
from modules.models import Model
from modules.referral import Referral
from modules.settings import Setting
from modules.validations import Validation
from modules.withdrawal import Withdrawal

Requests_page_bp = Blueprint("Requests_page_bp", __name__)
validate = Validation()
invest = Investment()
referral = Referral()
setting = Setting()
model = Model()
withdraw = Withdrawal()


def responseData(data):
    return {"data": data}


@Requests_page_bp.post('/filter-investment-type')
@validate.isLoggedIn
def filter_investment_type():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        if data := invest.filterPropertyBy_investmentType(cookie_id, data["data"]):
            return responseData(data)


@Requests_page_bp.post('/favourite-property')
@validate.isLoggedIn
def favourite_property():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    if data := request.get_json():
        if data := invest.favourite_property(cookie_id, data["id"], data["type"]):
            return responseData(data)


@Requests_page_bp.post('/my-favourite-properties')
@validate.isLoggedIn
def my_favourite_properties():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    if data := invest.get_userFavoriteProperties(cookie_id):
        return responseData(data)


@Requests_page_bp.post('/filter-properties-sub')
@validate.isLoggedIn
def filter_properties_sub():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        filtered_data = data["data"]
        curr_nav = data["curr_nav"]
        if data := invest.filterPropertyBy_subfilters(filtered_data, cookie_id, curr_nav):
            return responseData(data)


@Requests_page_bp.post('/filter-properties-search')
@validate.isLoggedIn
def filter_properties_search():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        filtered_data = data["data"]
        curr_nav = data["curr_nav"]
        if data := invest.filterPropertyBy_searchInput(filtered_data, cookie_id, curr_nav):
            return responseData(data)


@Requests_page_bp.post('/filter-properties-sortby')
@validate.isLoggedIn
def filter_properties_sortby():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        filtered_data = data["data"]
        curr_nav = data["curr_nav"]
        if data := invest.filterPropertyBy_sortBY(filtered_data, cookie_id, curr_nav):
            return responseData(data)


@Requests_page_bp.post('/filter-properties-sortbyview')
@validate.isLoggedIn
def filter_properties_sortbyview():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        filtered_data = data["data"]
        curr_nav = data["curr_nav"]
        if data := invest.filterPropertyBy_sortBYView(filtered_data, cookie_id, curr_nav):
            return responseData(data)


@Requests_page_bp.post('/loadplaninfo')
@validate.isLoggedIn
def loadplaninfo():
    if data := request.get_json():
        if data := invest.get_InvestmentPlanInfo(data["category"]):
            return responseData(data)


@Requests_page_bp.post('/CreateInvestment')
@validate.isLoggedIn
def CreateInvestment():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    investment_plan = config.sanitize_Html(request.form["plan"])
    property_id = config.sanitize_Html(request.form["property_id"])
    amount = config.sanitize_Html(request.form["amount"])

    if invest.createInvestment(cookie_id, property_id, investment_plan, amount, ):
        return responseData("created")


@Requests_page_bp.get('/invests')
@validate.isLoggedIn
def invests():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    if data := invest.get_UserInvestment(cookie_id):
        return responseData(data)


@Requests_page_bp.post('/verify-payment')
@validate.isLoggedIn
def verify_payment():
    if data := request.get_json():
        cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
        package_id = data["id"]
        payment_address = data["payment_address"]

        if invest.upadateInvestmentPayment(cookie_id, package_id, payment_address) is True:
            return responseData("success")
        else:
            return responseData("incorrect")


#
# @Requests_page_bp.post('/request-withdrawal')
# @validate.isLoggedIn
# def request_withdrawal():
#     amount = config.sanitize_Html(request.form["amount"])
#     cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
#     email = validate.get_Email_withCookie(validate.get_cookie_id(config.user_cookie))
#
#     if result := withdraw.requestWithdrawal(cookie_id, amount):
#         if result == "success":
#             code = validate.generate_verification_code()
#             model.updateData("update users set verification=%s where email=%s",
#                              value=(code, email,))
#             config.sendMail(email, "Withdrawal Verification", code)
#             return responseData("success")
#         else:
#             return responseData(result)
#
#
@Requests_page_bp.post('/profile-info')
@validate.isLoggedIn
def profile_info():
    cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
    user_details = validate.UserDetails(cookie_id)
    return user_details
#
#
# @Requests_page_bp.post('/verify-withdrawal')
# @validate.isLoggedIn
# def verify_withdrawal():
#     email = validate.get_Email_withCookie(validate.get_cookie_id(config.user_cookie))
#     cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
#     code = config.sanitize_Html(request.form['verification'])
#     amount = config.sanitize_Html(request.form['amount'])
#     wallet = validate.get_userWalletAddress_withCookie(validate.get_cookie_id(config.user_cookie))
#     if withdraw.CodeVerification(email, code):
#         setting.EmptyVerifyCodeIfSuccess(email, " ")
#         withdraw.createWithdrawal(cookie_id, amount, wallet)
#         invest.updateBalance(cookie_id, amount, "minus")
#         return "success"
#     else:
#         return "failed"
#
#
# @Requests_page_bp.get('/withdraw')
# @validate.isLoggedIn
# def withdraw_cash():
#     cookie_id = validate.get_userID_withCookie(validate.get_cookie_id(config.user_cookie))
#     if data := withdraw.get_UserWithdrawal(cookie_id):
#         return responseData(data)
