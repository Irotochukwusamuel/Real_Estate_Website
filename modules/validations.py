import functools
import json
import os
import shutil
import uuid
from datetime import date
from hashlib import sha256

import bcrypt
from flask import request, render_template, redirect, make_response, url_for

import config
from modules.database import db
from modules.investment import Investment
from modules.models import Model


class Validation:

    def __init__(self):
        self.cursor = db.cursor(buffered=True)
        self.model = Model()
        self.invest = Investment()

    @staticmethod
    def generate_cookie():
        gen_ID = uuid.uuid4().hex
        return gen_ID

    @staticmethod
    def generate_referral_code():
        gen_id = uuid.uuid4().hex
        return gen_id

    @staticmethod
    def generate_verification_code():
        gen_id = uuid.uuid4().node
        return str(gen_id)[1:8]

    @staticmethod
    def hash_key(value):
        hash_key = bcrypt.hashpw(value.encode(), bcrypt.gensalt())
        return hash_key.decode()

    @staticmethod
    def check_hash_key(key, hashed):
        if bcrypt.checkpw(key.encode(), hashed.encode()):
            return True
        else:
            return False

    @staticmethod
    def get_cookie_id(data):
        data = str(data)
        if get := request.cookies.get(data):
            return str(get)
        else:
            return False

    def isLoggedIn(self, func):
        @functools.wraps(func)
        def wrapper():
            if browser_cookie := self.get_cookie_id(config.user_cookie):
                if data := self.model.selectOneData(sql="select email from users where login_hash=%s",
                                                    value=(browser_cookie,)):
                    if data is not False:
                        return func()
                    else:
                        return redirect("/login")

            return redirect("/login")
        return wrapper

    def manual_isLoggedIn(self):
        if browser_cookie := self.get_cookie_id(config.user_cookie):
                if data := self.model.selectOneData(sql="select email from users where login_hash=%s",
                                                    value=(browser_cookie,)):
                    if data is not False:
                        return True
                    else:
                        return False

    def isDisabled(self, func):
        @functools.wraps(func)
        def wrapper():
            if browser_cookie := self.get_cookie_id(config.user_cookie):
                if isdisabled := self.model.selectOneData(sql="select disabled from users where login_hash=%s",
                                                          value=(browser_cookie,)):
                    if isdisabled == "No":
                        return func()

            res = make_response(redirect("/login"))
            res.set_cookie(config.user_cookie, "", expires=0)
            return res

        return wrapper

    def isAdmin(self, func):
        @functools.wraps(func)
        def wrapper():
            if browser_cookie := self.get_cookie_id(config.user_cookie):
                if res := self.model.selectOneData(sql="select isAdmin from users where login_hash=%s",
                                                   value=(browser_cookie,)):
                    if res == "Yes":
                        return func()
            return redirect("/login")

        return wrapper

    def Redirect_login(self, func):
        @functools.wraps(func)
        def wrapper():
            if browser_cookie := self.get_cookie_id(config.user_cookie):
                if self.model.selectOneData(sql="select email from users where login_hash=%s",
                                            value=(browser_cookie,)):
                    return redirect("/dashboard")
            return func()

        return wrapper

    def get_userID_withCookie(self, cookie):
        result = self.model.selectOneData(sql="select id from users where login_hash=%s", value=(cookie,))
        return result

    def get_userID_withUniqueID(self, unique_id):
        result = self.model.selectOneData(sql="select id from property where unique_id=%s", value=(unique_id,))
        return result

    def get_Email_withCookie(self, cookie):
        result = self.model.selectOneData(sql="select email from users where login_hash=%s", value=(cookie,))
        return result

    def get_Email_withID(self, ID):
        result = self.model.selectOneData(sql="select email from users where id=%s", value=(ID,))
        return result

    def get_datename(self, data):
        bd = data.split("-")
        date_ = date(int(bd[0]), int(bd[1]), int(bd[2]))
        return f"{date_.strftime('%A')}, {date_.strftime('%d %B %Y')}"

    def get_userDetails(self, ID):
        result = self.model.selectMultipleData("select lname,isAdmin from users where id=%s", value=(ID,))
        for x in result:
            return {
                "lastname": x[0],
                "isAdmin": x[1]
            }

    def total_investment(self, ID):
        result = self.model.selectOneData(sql="select investments from investment where user_id=%s", value=(ID,))
        if result == False or result is None:
            return {
                "investment": 0,
            }
        else:
            res_ = json.loads(result)["invest"]
            total_investment = len(res_)
            return {
                "investment": total_investment
            }

    def UserDetails(self, ID):
        result = self.model.selectMultipleData(
            "select email,fname,lname,ssn,phone,country,dob,gender,contact_address,isAdmin from users where id=%s",
            value=(ID,))
        for x in result:
            return {
                "firstname": x[1],
                "lastname": x[2],
                "email": x[0],
                "ssn": x[3],
                "phone": x[4],
                "country": x[5],
                "dob": x[6],
                "gender": x[7],
                "contact_address": x[8],
                "total_investements": self.total_investment(ID)["investment"],
                "pf": self.get_userProfilePhoto(ID, "profile"),
                "isAdmin": x[9]
            }

    @staticmethod
    def get_userProfilePhoto(ID, name):
        if name == "profile":
            if os.path.exists(os.path.join(config.basedir, config.image_save_location + str(ID), "profile.png")):
                return os.path.join(config.image_save_location + str(ID) + "/profile.png")
            else:
                return "/static/private_/profile.jpg"
        elif name == "kin":
            if os.path.exists(os.path.join(config.basedir, config.image_save_location + str(ID), "kin.png")):
                return os.path.join(config.image_save_location + str(ID) + "/kin.png")
            else:
                return "/static/private_/profile.jpg"

    @staticmethod
    def DeleteFilePath(ID):
        filepath = os.path.join(config.basedir, config.property_location + str(ID))
        if os.path.exists(filepath):
            shutil.rmtree(filepath)
            return True
        else:
            return "empty"

    def check_UserIsDisabled(self, email):
        result = self.model.selectOneData(sql="select disabled from users where email=%s", value=(email,))
        return result

    def check_UserIsAdmin(self, email):
        result = self.model.selectOneData(sql="select isAdmin from users where email=%s", value=(email,))
        return result

    def get_AllUsersLastTen(self):
        result = self.model.selectMultipleData("select * from users order by id desc limit 10")
        res = []
        for x in result:
            data = {
                "id": x[0],
                "firstname": x[2],
                "lastname": x[3],
                "email": x[1],
                "gender": x[8],
                "country": x[6],
                "ssn": x[4],
                "contact_address": x[9],
                "phone": x[5],
                "total_investments": self.total_investment(x[0])["investment"],
                "pf": self.get_userProfilePhoto(x[0], "profile"),
                "disabled": x[12],
                "isAdmin": x[13],
                "balance": f'{int(self.invest.get_UserBalance(x[0])):,}'
            }
            res.append(data)
        return res

    def get_AllUsers(self):
        result = self.model.selectMultipleData("select * from users")
        res = []
        for x in result:
            data = {
                "id": x[0],
                "firstname": x[2],
                "lastname": x[3],
                "email": x[1],
                "gender": x[8],
                "country": x[6],
                "ssn": x[4],
                "contact_address": x[9],
                "phone": x[5],
                "total_investments": self.total_investment(x[0])["investment"],
                "pf": self.get_userProfilePhoto(x[0], "profile"),
                "disabled": x[12],
                "isAdmin": x[13],
                "balance": f'{int(self.invest.get_UserBalance(x[0])):,}'
            }
            res.append(data)
        return res

    def Delete_Property(self, ID):
        if self.model.delete_row("property", ID, "id"):
            self.DeleteFilePath(ID)
            return True
        else:
            return False
