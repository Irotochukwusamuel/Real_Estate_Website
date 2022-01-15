import os

import config
from modules.database import db


class Model:
    def __init__(self):
        self.cursor = db.cursor(buffered=True)

    def checkDataExist(self, tableName, value, tableValue) -> bool:
        sql = f"select count(*) from {tableName} where {tableValue} = %s "
        add = (value,)
        self.cursor.execute(sql, add)
        result = self.cursor.fetchone()
        for x in result:
            if x > 0:
                return True
            else:
                return False

    def delete_row(self, tableName, value, tableValue):
        sql = f" delete from {tableName} where {tableValue} = %s "
        add = (value,)
        self.cursor.execute(sql, add)
        db.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False

    def insertData(self, sql=str, values=tuple):
        sql = sql
        val = values
        self.cursor.execute(sql, val)
        db.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False

    def updateData(self, sql=str, value=tuple):
        sql = sql
        val = value
        self.cursor.execute(sql, val)
        db.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False

    def selectOneData(self, sql=str, value=tuple):
        sql = sql
        val = value
        self.cursor.execute(sql, val)
        result = self.cursor.fetchone()
        if result is not None:
            for x in result:
                return x
            else:
                return False
        else:
            return False

    def selectMultipleData(self, sql=str, value=tuple):
        sql = sql
        val = value
        self.cursor.execute(sql, val)
        result = self.cursor.fetchall()
        if result is not None:
            return result
        else:
            return False

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
