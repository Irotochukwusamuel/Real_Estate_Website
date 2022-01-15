import json
from datetime import datetime

from modules.database import db
from modules.models import Model


class Referral:

    def __init__(self):
        self.cursor = db.cursor(buffered=True)
        self.model = Model()

    def get_TotalReferral(self, ID):
        result = self.model.selectOneData(sql="select referrals from referral where user_id=%s", value=(ID,))
        if result == False or result is None:
            return "0"
        else:
            return len(json.loads(result)["refs"])

    def addaslsa(self, userID, post_id):
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
                if data_ := [post_id]:
                    unwrapData["favs"].append(data_)
                    wrapData = json.dumps({"favs": unwrapData["favs"]})
                    sql = "update favourites set favs = %s where user_id=%s"
                    val = (wrapData, userID)
                    self.cursor.execute(sql, val)
                    db.commit()
                    if self.cursor.rowcount == 1:
                        return True


    def RefferalBonus(self, ID):
        result = self.model.selectOneData(sql="select balance from investment where user_id=%s", value=(ID,))
        bonus = 20
        if result == False or result is None or len(result) <= 0:
            self.model.updateData(sql="update investment set balance=%s where user_id=%s", value=(bonus, ID))
            return True
        else:
            bonus += int(result)
            self.model.updateData(sql="update investment set balance=%s where user_id=%s", value=(bonus, ID))
            return True



