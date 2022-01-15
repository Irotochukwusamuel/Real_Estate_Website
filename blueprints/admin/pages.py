from flask import Blueprint, render_template, request

import config
from modules.investment import Investment
from modules.referral import Referral
from modules.validations import Validation
from modules.withdrawal import Withdrawal

Admin_page_bp = Blueprint("Admin_page_bp", __name__)
validate = Validation()
invest = Investment()
referral = Referral()
withdraw = Withdrawal()


@Admin_page_bp.route('/AppAdmin')
@validate.isAdmin
def AppAdmin():
    data = validate.get_AllUsersLastTen()
    return render_template("admin/index.html", data=data, onload=invest.OnloadIndexDetails())


@Admin_page_bp.route('/AppAdmin/users')
@validate.isAdmin
def users_():
    data = validate.get_AllUsers()
    return render_template("admin/users.html", data=data)


@Admin_page_bp.route('/AppAdmin/transactions')
@validate.isAdmin
def transactions():
    data = invest.get_Transactions()
    return render_template("admin/transaction.html", data=data, onload=invest.OnloadTransactionDetails())


@Admin_page_bp.route('/AppAdmin/property')
@validate.isAdmin
def property():
    data = invest.get_AllProperties()
    return render_template("admin/property.html", data=data)
