import config
import datetime
import json
import os
import uuid
from datetime import date, datetime, timedelta
from modules.database import db
from modules.models import Model
from modules.referral import Referral


class Investment:

    def __init__(self):
        self.cursor = db.cursor(buffered=True)
        self.model = Model()
        self.model = Model()
        self.referral = Referral()
        self.config = config

    #
    def get_investmentFilters(self):
        result = self.model.selectMultipleData("select name,plans from investment_filter")
        b = []
        for x in result:
            b.append([x[0], json.loads(x[1])])
        N = 4
        parent = [b[n:n + N] for n in range(0, len(b), N)]
        return parent

    def get_AllPropertiesOnLoad(self, userID):
        result = self.model.selectMultipleData("select * from property")
        closed = []
        not_closed = []
        for x in result:
            x = list(x)
            is_closed = x[8]
            if self.check_propertyIsFavourite(userID, x[0]):
                x.append("isFavourite")
            else:
                x.append("notFavourite")
            if is_closed == "No":
                not_closed.append(x)
            else:
                closed.append(x)
            x.append(self.GetDate_Due(x[6], x[7], x[0]))
        return {
            "closed": closed,
            "not_closed": not_closed,
        }

    def get_propertyWithID(self, id):
        result = self.model.selectMultipleData("select * from property where id=%s", value=(id,))
        if result is not None and len(result) > 0:
            return result[0], self.get_PropertyImageWIthID(id), self.GetDate_Due(result[0][6], result[0][7], id)
        else:
            return "empty"

    def filterPropertyBy_investmentType(self, userID, data):
        data = str(data)
        result = self.model.selectMultipleData("select * from property where invest_type=%s", value=(data,))
        wrapper = []
        if len(result) > 0:
            for x in result:
                x = list(x)
                is_closed = x[8]
                if self.check_propertyIsFavourite(userID, x[0]):
                    x.append("isFavourite")
                else:
                    x.append("notFavourite")
                if is_closed == "No":
                    wrapper.append(x)
                    x.append(self.GetDate_Due(x[6], x[7], x[0]))
            if len(wrapper) > 0:
                return wrapper
            else:
                return "empty"
        else:
            return "empty"

    def favourite_property(self, userID, post_id, fav_type):
        if fav_type == "add":
            if sql := "select favs from favourites where user_id=%s":
                val = (userID,)
                self.cursor.execute(sql, val)
                res_ = self.cursor.fetchall()
                if len(res_) <= 0:
                    sql = "insert into favourites(user_id,favs) values (%s,%s)"
                    data_ = json.dumps({"favs": [post_id]})
                    val = (userID, data_)
                    self.cursor.execute(sql, val)
                    db.commit()
                    if self.cursor.rowcount == 1:
                        return True
                else:
                    result = res_[0]
                    unwrapData = json.loads(result[0])
                    if str(post_id) not in unwrapData["favs"]:
                        unwrapData["favs"].append(post_id)
                        wrapData = json.dumps({"favs": unwrapData["favs"]})
                        sql = "update favourites set favs = %s where user_id=%s"
                        val = (wrapData, userID)
                        self.cursor.execute(sql, val)
                        db.commit()
                        if self.cursor.rowcount == 1:
                            return True
                    else:
                        unwrapData["favs"].remove(str(post_id))
                        wrapData = json.dumps(unwrapData)
                        sql = "update favourites set favs = %s where user_id=%s"
                        val = (wrapData, userID)
                        self.cursor.execute(sql, val)
                        db.commit()
                        if self.cursor.rowcount == 1:
                            return True
        elif fav_type == "remove":
            if sql := "select favs from favourites where user_id=%s":
                val = (userID,)
                self.cursor.execute(sql, val)
                res_ = self.cursor.fetchall()
                result = res_[0]
                unwrapData = json.loads(result[0])
                if str(post_id) in unwrapData["favs"]:
                    unwrapData["favs"].remove(str(post_id))
                    wrapData = json.dumps(unwrapData)
                    sql = "update favourites set favs = %s where user_id=%s"
                    val = (wrapData, userID)
                    self.cursor.execute(sql, val)
                    db.commit()
                    if self.cursor.rowcount == 1:
                        return True
                else:
                    return False

    def get_userFavoriteProperties(self, userID):
        if sql := "select favs from favourites where user_id=%s":
            val = (userID,)
            self.cursor.execute(sql, val)
            res_ = self.cursor.fetchone()
            if res_ is not None:
                convert_ = json.loads(res_[0])
                if len(convert_["favs"]) > 0:
                    properties = []
                    for x in convert_["favs"]:
                        result = self.model.selectMultipleData("select * from property where id=%s", value=(x,))
                        data = list(result[0])
                        if self.check_propertyIsFavourite(userID, data[0]):
                            data.append("isFavourite")
                        else:
                            data.append("notFavourite")
                        data.append(self.GetDate_Due(data[6], data[7], data[0]))
                        properties.append(data)
                    return properties
                else:
                    return "empty"
            else:
                return "empty"

    def filterPropertyBy_subfilters(self, datas, userID, curr_nav):
        datas = datas
        query = []
        for x in datas:
            columns_ = self.config.matchfilter(x.strip())
            values = datas[x].replace(".0%", "").replace(".0x", "").replace("$", "").replace("years", "").replace(",",
                                                                                                                  "")

            if "-" in values:
                a = values.split("-")
                b = f"{columns_} between {a[0].replace('x', '')} and {a[1].replace('x', '')}"
                query.append(b)
            elif "<" in values or ">" in values or "<=" in values or ">=" in values:
                values.replace('x', '')
                query.append(f"{columns_} {values}")
            else:
                if values.isdigit() is not True:
                    query.append(f"{columns_} = '{values}'")
                else:
                    values.replace('x', '')
                    query.append(f"{columns_} = {values}")
        if curr_nav == "All":
            result = self.model.selectMultipleData(f"select * from property where {' and '.join(query)}")
        else:
            if len(query) > 0:
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' and {' and '.join(query)}")
            else:
                result = self.model.selectMultipleData(f"select * from property where invest_type = '{curr_nav}'")

        if len(result) <= 0:
            return "empty"
        else:
            properties = []
            for y in result:
                data_ = list(y)
                if self.check_propertyIsFavourite(userID, data_[0]):
                    data_.append("isFavourite")
                else:
                    data_.append("notFavourite")
                data_.append(self.GetDate_Due(data_[6], data_[7], data_[0]))
                properties.append(data_)
            return properties

    def filterPropertyBy_searchInput(self, datas, userID, curr_nav):
        if curr_nav == "All":
            result = self.model.selectMultipleData(
                f"select * from property where name like '%{datas}%' or city like '%{datas}%' or sponsor like '%{datas}%'")
        else:
            if len(datas) > 0:
                result = self.model.selectMultipleData(
                    f"select * from property where (name like '%{datas}%' or city like '%{datas}%' or sponsor like '%{datas}%') and  invest_type = '{curr_nav}'  ")
            else:
                result = self.model.selectMultipleData(f"select * from property where invest_type = '{curr_nav}'")
        if len(result) <= 0:
            return "empty"
        else:
            properties = []
            for y in result:
                data_ = list(y)
                if self.check_propertyIsFavourite(userID, data_[0]):
                    data_.append("isFavourite")
                else:
                    data_.append("notFavourite")
                data_.append(self.GetDate_Due(data_[6], data_[7], data_[0]))
                properties.append(data_)
            return properties

    def filterPropertyBy_sortBY(self, datas, userID, curr_nav):
        if curr_nav == "All":
            if datas == "All":
                result = self.model.selectMultipleData(
                    f"select * from property")
            elif datas == "Recently Updated":
                result = self.model.selectMultipleData(
                    f"select * from property order by id desc ")
            elif datas == "Recently Posted":
                result = self.model.selectMultipleData(
                    f"select * from property order by id desc ")
            elif datas == "IRR (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property order by irr desc")
            elif datas == "AVG Cash Yield (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property order by avg_cash_yield desc")
            elif datas == "Minimum Investment (Low to High)":
                result = self.model.selectMultipleData(
                    f"select * from property order by minimum_investment desc")
            elif datas == "Equity Multiple (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property order by equity_multiple desc")
        else:
            if datas == "All":
                result = self.model.selectMultipleData(
                    f"select * from property")
            elif datas == "Recently Updated":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by id desc ")
            elif datas == "Recently Posted":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by id desc ")
            elif datas == "IRR (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by irr desc")
            elif datas == "AVG Cash Yield (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by avg_cash_yield desc")
            elif datas == "Minimum Investment (Low to High)":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by minimum_investment desc")
            elif datas == "Equity Multiple (High to Low)":
                result = self.model.selectMultipleData(
                    f"select * from property where invest_type = '{curr_nav}' order by equity_multiple desc")

        if len(result) <= 0:
            return "empty"
        else:
            properties = []
            for y in result:
                data_ = list(y)
                if self.check_propertyIsFavourite(userID, data_[0]):
                    data_.append("isFavourite")
                else:
                    data_.append("notFavourite")
                data_.append(self.GetDate_Due(data_[6], data_[7], data_[0]))
                properties.append(data_)
            return properties

    def filterPropertyBy_sortBYView(self, datas, userID, curr_nav):
        if curr_nav == "All":
            if datas == "All":
                result = self.model.selectMultipleData(
                    f"select * from property where (offering = 'funded offerings' or offering = 'current offerings')")
            else:
                result = self.model.selectMultipleData(
                    f"select * from property where offering = '{datas}'")
        else:
            if datas == "All":
                result = self.model.selectMultipleData(
                    f"select * from property")
            else:
                result = self.model.selectMultipleData(
                    f"select * from property where (invest_type = '{curr_nav}' and offering = '{datas}') ")

        if len(result) <= 0:
            return "empty"
        else:
            properties = []
            for y in result:
                data_ = list(y)
                if self.check_propertyIsFavourite(userID, data_[0]):
                    data_.append("isFavourite")
                else:
                    data_.append("notFavourite")
                data_.append(self.GetDate_Due(data_[6], data_[7], data_[0]))
                properties.append(data_)
            return properties

    def check_propertyIsFavourite(self, userID, post_id):
        try:
            if sql := "select favs from favourites where user_id=%s":
                val = (userID,)
                self.cursor.execute(sql, val)
                res_ = self.cursor.fetchall()
                result = res_[0]
                unwrapData = json.loads(result[0])
                if str(post_id) in unwrapData["favs"]:
                    return True
                else:
                    return False
        except IndexError:
            return False

    def get_InvestmentPlanInfo(self, ID):
        if result := self.model.selectMultipleData(sql="select amount,percent,max from packages where plan=%s",
                                                   value=(ID,)):
            for x in result:
                return {
                    "amount": x[0],
                    "percent": x[1],
                    "max": x[2]
                }

    def get_ROI(self, plan):
        if result := self.model.selectOneData(sql="select percent from packages where plan=%s", value=(plan,)):
            return int(str(result).replace("%", ""))

    def createInvestment(self, ID, property_id, plan, amount):

        investment_id = str(datetime.now()).replace(" ", "").split(".")[0].replace("-", "").replace(":", "")
        time = str(datetime.now()).split(".")[0]
        roi = str(int(int(amount) * self.get_ROI(plan) / 100) + int(amount))

        if sql := "select investments from investment where user_id=%s":
            val = (ID,)
            self.cursor.execute(sql, val)
            res_ = self.cursor.fetchall()
            if len(res_) <= 0:
                sql = "insert into investment(user_id,investments) values (%s,%s)"

                data_ = json.dumps({"invest": [
                    {"id": investment_id, "property_id": property_id, "plan": plan,
                     "amount": amount, "time": time, "roi": roi, "status": "waiting", "expiration": "not set",
                     "wallet_address": "not set"}]
                })
                val = (ID, data_)
                self.cursor.execute(sql, val)
                db.commit()
                if self.cursor.rowcount == 1:
                    config.InvestmentEmail(self.get_Email_withID(ID), "New Investment",
                                           f"<p style='font-size:14px'> You have made a new investment of ${int(amount):,} on {self.get_propertyName(property_id)} and your REIT is {int(roi):,}</p>")
                    return True
            else:
                result = res_[0]
                unwrapData = json.loads(result[0])
                data_ = {"id": investment_id, "property_id": property_id, "plan": plan,
                         "amount": amount, "time": time, "roi": roi, "status": "waiting", "expiration": "not set",
                         "wallet_address": "not set"}

                unwrapData["invest"].append(data_)
                wrapData = json.dumps({"invest": unwrapData["invest"]})
                config.InvestmentEmail(self.get_Email_withID(ID), "New Investment",
                                       f"<p style='font-size:14px'>You have made a new investment of ${int(amount):,} on {self.get_propertyName(property_id)} and your REIT is {int(roi):,}</p>")
                sql = "update investment set investments = %s where user_id=%s"
                val = (wrapData, ID)
                self.cursor.execute(sql, val)
                db.commit()
                if self.cursor.rowcount == 1:
                    return True

    def get_propertyName(self, id):
        result = self.model.selectOneData("select name from property where id=%s", value=(id,))
        return result

    def get_UserInvestment(self, ID):
        result = self.model.selectOneData("select investments from investment where user_id=%s", value=(ID,))
        if result != False and result is not None:
            data = json.loads(result)
            message = data["invest"]
            wrapper = []
            for x in message:
                details = {
                    "id": x['id'],
                    "property_id": self.get_propertyName(x["property_id"]),
                    "plan": x["plan"].split("(")[0],
                    "time": x["time"],
                    "amount": f'{int(x["amount"]):,}',
                    "status": x["status"],
                    "roi": f'{int(x["roi"]):,}',
                    "expiration": x["expiration"]
                }
                wrapper.append(details)
            return wrapper
        else:
            return "no_investment"

    def upadateInvestmentPayment(self, ID, package_id, wallet_address):
        if result := self.model.selectOneData(sql="select investments from investment where user_id=%s",
                                              value=(ID,)):
            unwrapData = json.loads(result)
            for x in unwrapData["invest"]:
                if x["id"] == package_id:
                    x["status"] = "pending"
                    x["wallet_address"] = wallet_address
            res = json.dumps(unwrapData)
            if self.model.updateData(sql="update investment set investments = %s where user_id=%s",
                                     value=(res, ID)):
                return True

    def check_IsInvested(self, userid, propertyid):
        result = self.model.selectOneData("select investments from investment where user_id=%s", value=(userid,))
        if result != False and result is not None:
            convert = json.loads(result)["invest"]
            for x in convert:
                if propertyid == int(x["property_id"]):
                    return True
                else:
                    return False
        else:
            return False

    def get_UserPortfolio(self, ID):
        result = self.model.selectMultipleData(sql="select * from investment where user_id=%s", value=(ID,))
        total_approved = []
        total_amount = []
        properties = []
        for x in result:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                if b["status"] == "approved" or b["status"] == "closed":
                    total_approved.append(b)
                    total_amount.append(int(b["amount"]))
                    properties.append({
                        "id": b["property_id"],
                        "name": self.get_propertyName(b["property_id"]),
                        "plan": b["plan"],
                        "reit": f'{int(b["roi"]):,}',
                        "status": b["status"],
                        "reit_percent": self.get_ROI(b["plan"]),
                        "date": b["time"].split(" ")[0].replace("-", "/")
                    })

        return {
            "approved": len(total_approved),
            "total_amount": f"{sum(total_amount):,}",
            "total_properties": len(properties),
            "properties": properties
        }

    def get_UserBalance(self, ID):
        result = self.model.selectOneData(sql="select balance from investment where user_id=%s", value=(ID,))
        if result == False or result is None or len(result) <= 0:
            return "0"
        else:
            return result

    def get_Email_withID(self, ID):
        result = self.model.selectOneData(sql="select email from users where id=%s", value=(ID,))
        return result

    def get_Transactions(self):
        result = self.model.selectMultipleData(sql="select * from investment")
        trans_ = []
        for x in result:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                pf = self.model.get_userProfilePhoto(x[1], "profile")
                email = self.get_Email_withID(x[1])
                b.update({"pf": pf})
                b.update({"email": email})
                trans_.append(b)
        return trans_

    def updateBalance(self, ID, amount, type):
        amount = int(amount)
        result = self.model.selectOneData(sql="select balance from investment where user_id=%s", value=(ID,))
        if result == False or result is None or len(result) <= 0:
            if type == "add":
                self.model.updateData(sql="update investment set balance=%s where user_id=%s", value=(amount, ID))
                return True
        else:
            if type == "add":
                amount = int(result) + amount
                self.model.updateData(sql="update investment set balance=%s where user_id=%s", value=(amount, ID))
                return True
            elif type == "minus":
                amount = int(result) - amount
                if amount < 0:
                    amount = 0
                self.model.updateData(sql="update investment set balance=%s where user_id=%s", value=(amount, ID))
                return True

    def GetDate_Due(self, begin, end, ID):
        begin = begin.split("-")
        end = end.split("-")
        if date.today() >= date(int(end[0]), int(end[1]), int(end[2])):
            self.model.updateData(sql="update property set is_closed=%s where id=%s", value=("Yes", ID))
            return ""
        else:
            if date.today() >= date(int(begin[0]), int(begin[1]), int(begin[2])):
                self.model.updateData(sql="update property set is_closed=%s where id=%s", value=("No", ID))
                return ""
            else:
                c = date(int(begin[0]), int(begin[1]), int(begin[2])) - date.today()
                self.model.updateData(sql="update property set is_closed=%s where id=%s", value=("No", ID))
                return f"Investing begins in {c.days} days"

    def get_TransactionById(self, ID):
        result = self.model.selectMultipleData(sql="select * from investment")
        for x in result:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                if b["id"] == str(ID):
                    email = self.get_Email_withID(x[1])
                    return {
                        "email": email,
                        "name": self.get_propertyName(b["property_id"]),
                        "plan": b["plan"].split("(")[0],
                        "time": b["time"].split(" ")[0].replace("-", "/"),
                        "amount": f'{int(b["amount"]):,}',
                        "status": b["status"],
                        "roi": f'{int(b["roi"]):,}',
                        "expiration": b["expiration"],
                        "wallet_address": b["wallet_address"]
                    }

    def change_TransactionStatus(self, ID, status):
        result = self.model.selectMultipleData(sql="select * from investment")
        for x in result:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                if b["id"] == str(ID):
                    b["status"] = status
                    user_id = x[1]
                    if status == "approved":
                        time = str(datetime.now()).split(".")[0]
                        duration = int(b["plan"].split("(")[1].split(" ")[0])
                        expire_date = self.get_expirationDate(time, duration)
                        b.update({"expiration": expire_date})
                        config.InvestmentEmail(self.get_Email_withID(user_id), "Investment Update",
                                               f"<p style='font-size:12px'> Your investment on {self.get_propertyName(b['property_id'])} has been Approved and you will get ${int(b['roi']):,} as REIT at the end of your investment on {expire_date} </p>")
                        # self.updateBalance(user_id, b["roi"], "minus")

                    elif status == "waiting" or status == "pending":
                        b.update({"expiration": "not set"})
                        self.updateBalance(user_id, b["roi"], "minus")
                    elif status == "closed":
                        self.updateBalance(user_id, b["roi"], "add")
                    elif status == "decline":
                        config.InvestmentEmail(self.get_Email_withID(ID), "Investment Update",
                                               f" Unfortunately your investment on {self.get_propertyName(b['property_id'])} has been declined.")
                    res = json.dumps(invest)
                    if self.model.updateData(sql="update investment set investments = %s where user_id=%s",
                                             value=(res, user_id)):
                        return True

    def OnloadTransactionDetails(self):
        result = self.model.selectMultipleData(sql="select * from investment")
        total_approved = []
        total_pending = []
        total_amount = []
        for x in result:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                if b["status"] == "approved":
                    total_approved.append(b)
                    total_amount.append(int(b["amount"]))
                elif b["status"] == "pending":
                    total_pending.append(b)
        return {
            "approved": len(total_approved),
            "pending": len(total_pending),
            "total_amount": f"{sum(total_amount):,}"
        }

    @staticmethod
    def get_expirationDate(data, duration):
        a = data.split(" ")[0]
        bd = a.split("-")
        date_ = date(int(bd[0]), int(bd[1]), int(bd[2]))
        expire_day = date_ + timedelta(days=duration)
        day_name = expire_day.strftime("%a")
        expire_full_name = f'{day_name}, {expire_day.strftime("%d %b %Y")}'
        return expire_full_name

    def OnloadIndexDetails(self):
        users = self.model.selectMultipleData(sql="select * from users")
        trans = self.model.selectMultipleData(sql="select * from investment")
        total_trans = []
        total_amount = []
        total_users = len(users)
        for x in trans:
            invest = json.loads(x[2])
            for b in invest["invest"]:
                total_trans.append(b)
                if b["status"] == "approved":
                    total_amount.append(int(b["amount"]))
        return {
            "total_users": total_users,
            "total_trans": len(total_trans),
            "total_amount": f"{sum(total_amount):,}"
        }

    def get_AllProperties(self):
        result = self.model.selectMultipleData("select id,name,state,city,sponsor,invest_type,is_closed from property")
        property = []
        if len(result) > 0 and result is not None:
            for x in result:
                property.append({
                    "id": x[0],
                    "name": x[1],
                    "state": x[2],
                    "city": x[3],
                    "sponsor": x[4],
                    "invest_type": x[5],
                    "is_closed": x[6]
                })
            return {
                "properties": property,
                "total_properties": len(property),
                "total_closed": len([x for x in property if x["is_closed"] == "Yes"]),
                "total_open": len([x for x in property if x["is_closed"] == "No"])
            }
        else:
            return "empty"

    def get_PropertyById(self, ID):
        result = self.model.selectMultipleData("select * from property where id=%s", value=(ID,))
        if len(result) > 0 and result is not None:
            for x in result:
                return {
                    "id": x[0],
                    "name": x[1],
                    "state": x[2],
                    "city": x[3],
                    "sponsor": x[4],
                    "invest_type": x[5],
                    "invest_begins": x[6],
                    "invest_ends": x[7],
                    "is_closed": x[8],
                    "irr": x[9],
                    "avg_cash_yield": x[10],
                    "preferred_return": x[11],
                    "equity_multiple": x[12],
                    "minimum_investment": x[13],
                    "minimum_hold_period": x[14],
                    "loan_to_cost": x[15],
                    "distribution_period": x[16],
                    "investment_structure": x[17],
                    "investment_profile": x[18],
                    "properties_type": x[19],
                    "property_region": x[20],
                    "sample_products": x[21],
                    "sponsor_experience": x[22],
                    "sponsor_co_investment": x[23],
                    "repeat_sponsors": x[24],
                    "investor_accreditation": x[25],
                    "exchange": x[26],
                    "opportunity_zone": x[27],
                    "SD_IRA_eligible": x[28],
                    "invest_plan": x[29],
                    "offering": x[30],
                    "desc": x[31],
                    "investment_summary": x[34],
                    "property_image": self.get_PropertyImageWIthID(ID)
                }
        else:
            return "empty"

    @staticmethod
    def get_PropertyImageWIthID(ID):
        try:
            path = os.path.join(config.basedir, config.property_location, str(ID))
            access = os.listdir(path)
            if access is None:
                return "empty"
            else:
                res = {}
                count = 1
                for x in access:
                    res[count] = x
                    count += 1
                return res

        except FileNotFoundError:
            return "empty"

    def AddNewProperty(self, name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr,
                       avg_cash_yield, preferred_return, equity_multiple, minimum_investment, minimum_hold_period,
                       loan_to_cost, distribution_period, investment_structure, investment_profile, properties_type,
                       property_region, sample_products, sponsor_experience, sponsor_co_investment, repeat_sponsors,
                       investor_accreditation, exchange, opportunity_zone, SD_IRA_eligible, invest_plan, offering,
                       description, unique_id, investment_summary):
        rand = str(uuid.uuid4())
        sql = "insert into  property(name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, " \
              "irr, avg_cash_yield, preferred_return, equity_multiple, minimum_investment, minimum_hold_period, " \
              "loan_to_cost, distribution_period, investment_structure, investment_profile, properties_type, " \
              "property_region, sample_products, sponsor_experience, sponsor_co_investment, repeat_sponsors, " \
              "investor_accreditation, exchange, opportunity_zone, SD_IRA_eligible, invest_plan, offering, " \
              "description,unique_id,rand,investment_summary) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s," \
              "%s,%s,%s,%s,%s,%s,%s)"
        val = (name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr, avg_cash_yield,
               preferred_return, equity_multiple, minimum_investment, minimum_hold_period, loan_to_cost,
               distribution_period, investment_structure, investment_profile, properties_type, property_region,
               sample_products, sponsor_experience, sponsor_co_investment, repeat_sponsors, investor_accreditation,
               exchange, opportunity_zone, SD_IRA_eligible, invest_plan, offering, description, unique_id, rand,
               investment_summary,)
        self.cursor.execute(sql, val)
        db.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False

    def EditProperty(self, name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr,
                     avg_cash_yield, preferred_return, equity_multiple, minimum_investment, minimum_hold_period,
                     loan_to_cost, distribution_period, investment_structure, investment_profile, properties_type,
                     property_region, sample_products, sponsor_experience, sponsor_co_investment, repeat_sponsors,
                     investor_accreditation, exchange, opportunity_zone, SD_IRA_eligible, invest_plan, offering,
                     description, ID, investment_summary):
        rand = str(uuid.uuid4())
        sql = "update property set name=%s, state=%s, city=%s, sponsor=%s, invest_type=%s, invest_begins=%s, invest_ends=%s, is_closed=%s, " \
              "irr=%s, avg_cash_yield=%s, preferred_return=%s, equity_multiple=%s, minimum_investment=%s, minimum_hold_period=%s, " \
              "loan_to_cost=%s, distribution_period=%s, investment_structure=%s, investment_profile=%s, " \
              "properties_type=%s, " \
              "property_region=%s, sample_products=%s, sponsor_experience=%s, sponsor_co_investment=%s, repeat_sponsors=%s, " \
              "investor_accreditation=%s, exchange=%s, opportunity_zone=%s, SD_IRA_eligible=%s, invest_plan=%s, " \
              "offering=%s, " \
              "description=%s,rand=%s,investment_summary=%s where id=%s"
        val = (name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr, avg_cash_yield,
               preferred_return, equity_multiple, minimum_investment, minimum_hold_period, loan_to_cost,
               distribution_period, investment_structure, investment_profile, properties_type, property_region,
               sample_products, sponsor_experience, sponsor_co_investment, repeat_sponsors, investor_accreditation,
               exchange, opportunity_zone, SD_IRA_eligible, invest_plan, offering, description, rand,
               investment_summary, ID)
        self.cursor.execute(sql, val)
        db.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False


a = Investment()
print(a.get_investmentFilters())