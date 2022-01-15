import datetime
import json
from datetime import datetime

from modules.database import db
from modules.models import Model
from modules.investment import Investment


class Withdrawal:

    def __init__(self):
        self.cursor = db.cursor(buffered=True)
        self.model = Model()
        self.invest = Investment()

    def createWithdrawal(self, ID, amount, wallet):

        withdrawal_id = str(datetime.now()).replace(" ", "").split(".")[0].replace("-", "").replace(":", "")
        time = str(datetime.now()).split(".")[0]

        if sql := "select withdrawals from withdrawal where user_id=%s":
            val = (ID,)
            self.cursor.execute(sql, val)
            res_ = self.cursor.fetchall()
            if len(res_) <= 0:
                sql = "insert into withdrawal(user_id,withdrawals) values (%s,%s)"
                data_ = json.dumps({"withdrawal": [
                    {"id": withdrawal_id,
                     "amount": amount,
                     "wallet_address": wallet, "time": time, "status": "pending"}]
                })
                val = (ID, data_)
                self.cursor.execute(sql, val)
                db.commit()
                if self.cursor.rowcount == 1:
                    return True
            else:
                result = res_[0]
                unwrapData = json.loads(result[0])
                data_ = {"id": withdrawal_id,
                         "amount": amount,
                         "wallet_address": wallet, "time": time, "status": "pending"}

                unwrapData["withdrawal"].append(data_)
                wrapData = json.dumps({"withdrawal": unwrapData["withdrawal"]})
                sql = "update withdrawal set withdrawals = %s where user_id=%s"
                val = (wrapData, ID)
                self.cursor.execute(sql, val)
                db.commit()
                if self.cursor.rowcount == 1:
                    return True

    def requestWithdrawal(self, ID, amount):
        result = self.model.selectOneData("select balance from investment where user_id=%s", value=(ID,))
        if result == "" or result is None or result == False:
            return "insufficient fund"
        else:
            if int(amount) > int(result):
                return "insufficient fund"
            else:
                return "success"

    def CodeVerification(self, email, code):
        result = self.model.selectOneData(sql="select verification from users where email=%s", value=(email,))
        if str(result) == str(code):
            return True
        else:
            return False

    def get_Email_withID(self, ID):
        result = self.model.selectOneData(sql="select email from users where id=%s", value=(ID,))
        return result

    def check_UserHasWithdrawal(self, ID):
        result = self.model.selectOneData(sql="select withdrawals from withdrawal where user_id=%s", value=(ID,))
        if result == False or result is None:
            return True
        else:
            return False

    def get_UserWithdrawal(self, ID):
        if self.check_UserHasWithdrawal(ID):
            return "no_withdrawal"
        else:
            result = self.model.selectOneData("select withdrawals from withdrawal where user_id=%s", value=(ID,))
            data = json.loads(result)
            message = data["withdrawal"]
            wrapper = []
            for x in message:
                details = {
                    "id": x['id'],
                    "time": x["time"],
                    "amount": f'{int(x["amount"]):,}',
                    "status": x["status"],
                }
                wrapper.append(details)
            return wrapper

    def get_Withdrawals(self):
        result = self.model.selectMultipleData(sql="select * from withdrawal")
        trans_ = []
        for x in result:
            invest = json.loads(x[2])
            for b in invest["withdrawal"]:
                pf = self.model.get_userProfilePhoto(x[1], "profile")
                email = self.get_Email_withID(x[1])
                b.update({"pf": pf})
                b.update({"email": email})
                trans_.append(b)
        return trans_

    def OnloadWithdrawalDetails(self):
        result = self.model.selectMultipleData(sql="select * from withdrawal")
        total_approved = []
        total_pending = []
        total_amount = []
        for x in result:
            withdraw = json.loads(x[2])
            for b in withdraw["withdrawal"]:
                if b["status"] == "approved":
                    total_approved.append(b)
                    total_amount.append(int(b["amount"]))
                elif b["status"] == "pending":
                    total_pending.append(b)
        return {
            "approved": len(total_approved),
            "pending": len(total_pending),
            "total_amount": f"{sum(total_amount):,}"}

    def change_WithdrawalStatus(self, ID, status):
        result = self.model.selectMultipleData(sql="select * from withdrawal")
        for x in result:
            withdraw = json.loads(x[2])
            for b in withdraw["withdrawal"]:
                if b["id"] == str(ID):
                    b["status"] = status
                    user_id = x[1]
                    if status == "decline":
                        self.invest.updateBalance(user_id, b["amount"], "add")
                    elif status == "pending" or status == "closed" or status == "approved":
                        self.invest.updateBalance(user_id, b["amount"], "minus")
                    res = json.dumps(withdraw)
                    if self.model.updateData(sql="update withdrawal set withdrawals = %s where user_id=%s",
                                             value=(res, user_id)):
                        return True
