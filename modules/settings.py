import base64
import io
import os
import uuid
import PIL
from PIL import Image
from flask import request
from werkzeug.utils import secure_filename
import config
from modules.database import db
from modules.models import Model
from modules.validations import Validation


class Setting:

    def __init__(self):
        self.cursor = db.cursor(buffered=True)
        self.model = Model()
        self.validate = Validation()

    @staticmethod
    def allowed_image(filename):
        if "." not in filename:
            return False

        ext = filename.rsplit(".", 1)[1]
        if ext.upper() in ["JPEG", "JPG", "PNG", "GIF"]:
            return True
        else:
            return "Unsupported Image Type"

    @staticmethod
    def compress_Image(name):
        path = os.path.join(config.basedir, name)
        profile = Image.open(path)
        profile = profile.resize((600, 600), Image.ANTIALIAS)
        profile.save(path, optimize=True, quality=100)

    @staticmethod
    def validate_photo(ID, image_data, name):
        im = Image.open(io.BytesIO(base64.b64decode(str(image_data))))
        im = im.resize((300, 300), Image.ANTIALIAS)

        image_name = ""
        if name == "profile":
            image_name += str("profile" + ".png")
        elif name == "kin":
            image_name += str("kin" + ".png")

        if not os.path.exists(os.path.join(config.basedir, config.image_save_location + str(ID))):
            os.mkdir(os.path.join(config.basedir, config.image_save_location + str(ID)))

        if im.mode in ["RGBA", "P", "RGB"]:
            im.convert('RGB')
            loc = os.path.join(config.basedir, config.image_save_location, str(ID), image_name)
            im.save(loc, optimize=True, quality=75)
        return True

    def process_photo(self, image_name, unique_id):
        try:
            file_name = 1
            for file in request.files.getlist(image_name):
                im = Image.open(file)
                im = im.resize((300, 300), Image.ANTIALIAS)
                if file.filename == "":
                    return "file has no name"

                if self.allowed_image(file.filename):
                    filename = secure_filename(file.filename)
                    filename = str(file_name) + '.png'

                    new_path = os.path.join(config.basedir, config.property_location + str(unique_id))
                    if not os.path.exists(new_path):
                        os.mkdir(new_path)

                    file_name += 1
                    if im.mode in ["RGBA", "P", "RGB"]:
                        im.convert('RGB')
                        loc = os.path.join(new_path, filename)
                        im.save(loc, optimize=True, quality=30)
            return True
        except PIL.UnidentifiedImageError:
            return True
        finally:
            return True

    def Changepassword(self, email, password, newpassword):
        db_password = self.model.selectOneData(sql="select password from users where email=%s", value=(email,))
        if self.validate.check_hash_key(password, db_password):
            if self.validate.check_hash_key(newpassword, db_password):
                return "password-exist"
            newpass = self.validate.hash_key(newpassword)
            if self.model.updateData(sql="update users set password=%s where email=%s", value=(newpass, email)):
                return "success"
        else:
            return "incorrect-password"

    def ChangeForgotPassword(self, email, password1, password2):
        if password1 == password2:
            newpass = self.validate.hash_key(password1)
            rand = uuid.uuid4().hex
            if self.model.updateData(sql="update users set rand=%s, password=%s where email=%s",
                                     value=(rand, newpass, email)):
                return "success"
        else:
            return "incorrect-password"

    def Changeemail(self, ID, new_email):
        email = self.validate.get_Email_withID(ID)
        print(email, new_email)
        if new_email == email:
            return "email-exist"
        else:
            self.model.updateData(sql="update users set email=%s where id=%s", value=(new_email, ID))
            return "success"

    def UpdateBio(self, ID, fname, lname, gender, ssn, contact, phone):
        rand = uuid.uuid4().hex
        if self.model.updateData(
                sql="update users set fname=%s,lname=%s,gender=%s,ssn=%s,contact_address=%s,"
                    "phone=%s,rand=%s where id=%s",
                value=(fname, lname, gender, ssn, contact, phone, rand, ID,)):
            return "success"

    def ChangeDisabledStatus(self, ID, value):
        rand = uuid.uuid4().hex
        if self.model.updateData(sql="update users set rand=%s, disabled=%s where id=%s", value=(rand, value, ID,)):
            return "success"

    def ChangeIsAdminStatus(self, ID, value):
        rand = uuid.uuid4().hex
        if self.model.updateData(sql="update users set rand=%s, isAdmin=%s where id=%s", value=(rand, value, ID,)):
            return "success"

    def EmptyVerifyCodeIfSuccess(self, ID, value):
        rand = uuid.uuid4().hex
        if self.model.updateData(sql="update users set rand=%s, verification=%s where email=%s",
                                 value=(rand, value, ID,)):
            return "success"
