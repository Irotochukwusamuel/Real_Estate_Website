# pylint: disable=no-member
import math
import os
import time
from pprint import pprint

import bleach
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

basedir = os.path.abspath(os.path.dirname(__file__))

# THE APP NAME
admin_id = "admin"

# THE DATABASE NAME
database_name = 'axistones'
db_host = 'localhost'
db_username = 'root'
db_password = ''

# database_name = 'sample_samples'
# db_host = 'localhost'
# db_username = 'sample_root'
# db_password = '-%f5jPAfcJ&H'


# Instantiate the client\
# Configure API key authorization: api-key
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key[
    'api-key'] = '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'

# cookie storgae key word
user_cookie = "arz_"

image_save_location = "static/upload/"
property_location = "static/private_/houses/"


def matchfilter(data):
    result = {
        "name": "name",
        "state": "state",
        "city": "city",
        "sponsor": "sponsor",
        "IRR": "irr",
        "AVG Cash Yield": "avg_cash_yield",
        "Preferred Return": "preferred_return",
        "Equity Multiple": "equity_multiple",
        "Minimum Investment": "minimum_investment",
        "Minimum Hold Period": "minimum_hold_period",
        "Loan-to-Cost": "loan_to_cost",
        "Distribution Period": "distribution_period",
        "Investment Structure": "investment_structure",
        "Investment Profile": "investment_profile",
        "Property Type": "properties_type",
        "Region": "property_region",
        "sample": "sample_products",
        "Sponsor Experience": "sponsor_experience",
        "Sponsor Co-investment": "sponsor_co_investment",
        "Repeat": "repeat_sponsors",
        "Investor Accreditation": "investor_accreditation",
        "1031 Exchange": "exchange",
        "Opportunity Zone": "opportunity_zone",
        "SD-IRA Eligible": "SD_IRA_eligible"
    }
    return result[data]


def WelcomeMail(to, subject, name):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    subject = f'{subject}'
    html_content = f'<div style="width: 90%;margin: auto;border: 1px solid lightgray; background: white;height: 55vh;"><div style="height: 90px;background: #1d1d54;color: white;font-size: 23px;font-family: sans-serif;letter-spacing: 0.5px;text-align: center;display:table-cell;vertical-align: middle;width:100vw;"> Welcome to samples</div><p style="padding: 20px;font-family: sans-serif;letter-spacing:0.5px;color: #464141; font-size:15px;">Hi {name},</p><div style="padding: 0 20px 20px 20px;"><p style="font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size: 15px;margin-bottom: 10px;">Thanks for creating account on with samples!. Your username is {to}. You can access your account area to view properties and invest in properties without owning a house and make good profits<br> Click on the link below to get started on amazing Investment Offers with samples! <a href ="https://www.samples.net/dashboard" style="color: inherit;text-decoration:underline;letter-spacing: 0.5px;font-size:15px;">Marketplace</a></div></div>'
    sender = {"name": "sample", "email": "Support@samples.net"}
    to = [{"email": f'{to}', "name": f'{name}'}]
    reply_to = {"email": "Support@samples.net", "name": "sample"}
    headers = {"Some-Custom-Name": "unique-id-1234"}
    params = {"parameter": "My param value", "subject": "New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=reply_to, headers=headers,
                                                   html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
        return True
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
        return True
    finally:
        return True


def sendMail(to, subject, content):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    subject = f'{subject}'
    html_content = f'<div style="width: 90%;margin: auto;border: 1px solid lightgray; background: white;height:55vh;"><div style="height: 90px;background: #424242;color: white;font-size: 23px;font-family: sans-serif;letter-spacing: 0.5px;text-align: center;display:table-cell;vertical-align: middle;width:100vw;"> {subject}</div><p style="padding: 20px;font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size:15px;">Hello,</p><div style="padding: 0 20px 20px 20px;"><p style="font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size: 15px;margin-bottom: 10px;">This is your verification code - <b style="font-size:14px">{content}</b></p></div></div>'
    sender = {"name": "sample", "email": "Support@samples.net"}
    to = [{"email": f'{to}', "name": f'{to.split("@")[0]}'}]
    reply_to = {"email": "Support@samples.net", "name": "sample"}
    headers = {"Some-Custom-Name": "unique-id-1234"}
    params = {"parameter": "My param value", "subject": "New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=reply_to, headers=headers,
                                                   html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
        return True
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
        return True
    finally:
        return True


def ContactUs(from_, subject, message, name):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    subject = f'{subject}'
    html_content = f'<div style="width: 90%;margin: auto;border: 1px solid lightgray; background: white;height:55vh;"><div style="height: 90px;background: #424242;color: white;font-size: 23px;font-family: sans-serif;letter-spacing: 0.5px;text-align: center;display:table-cell;vertical-align: middle;width:100vw;">Contact Us</div><p style="padding: 20px;font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size:15px;">Hello,</p><div style="padding: 0 20px 20px 20px;"><p style="font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size: 13px;margin-bottom: 10px;">{message}</p><p style="margin-top:10px;font-size:14px">From {name}</p></div></div>'
    sender = {"name": f'{from_.split("@")[0]}', "email": f"{from_}"}
    to = [{"email": 'Support@samples.net', "name": 'samples'}]
    reply_to = {"email": "Support@samples.net", "name": "sample"}
    headers = {"Some-Custom-Name": "unique-id-1234"}
    params = {"parameter": "My param value", "subject": "New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=reply_to, headers=headers,
                                                   html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
        return True
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
        return True
    finally:
        return True


def InvestmentEmail(to, subject, content):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    subject = f'{subject}'
    html_content = f'<div style="width: 90%;margin: auto;border: 1px solid lightgray; background: white;height:55vh;"><div style="height: 90px;background: #424242;color: white;font-size: 23px;font-family: sans-serif;letter-spacing: 0.5px;text-align: center;display:table-cell;vertical-align: middle;width:100vw;"> {subject}</div><p style="padding: 20px;font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size:15px;">Hello,</p><div style="padding: 0 20px 20px 20px;"><p style="font-family: sans-serif;letter-spacing: 0.5px;color: #464141; font-size: 15px;margin-bottom: 10px;"> <b style="font-size:14px">{content}</b></p></div></div>'
    sender = {"name": "sample", "email": "Support@samples.net"}
    to = [{"email": f'{to}', "name": f'{to.split("@")[0]}'}]
    reply_to = {"email": "Support@samples.net", "name": "sample"}
    headers = {"Some-Custom-Name": "unique-id-1234"}
    params = {"parameter": "My param value", "subject": "New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=reply_to, headers=headers,
                                                   html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
        return True
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)
        return True
    finally:
        return True


# CLEANING USER INPUT
def sanitize_Html(value):
    value = bleach.clean(value)
    return value


def TimeConverter(delta, **kw):
    halfstr = u'\u00BD'
    nohalf = u''
    # Now
    if delta < 0.5:
        return u'now'

    # < 1 hour
    mins = delta / 60.
    if mins < 1.5:
        return u'1m'
    if mins < 60:
        return u'%dm' % math.ceil(mins)

    # < 1 day
    if mins < 75:
        return u'1h'
    hours, mins = divmod(mins, 60)
    if 15 <= mins <= 45:
        half = halfstr
    else:
        half = nohalf
        if mins > 45:
            hours += 1
    if hours < 24:
        return u'%dh' % math.ceil(hours)

    # < 7 days
    if hours < 30:
        return u'1d'
    days, hours = divmod(hours, 24)
    if 6 <= hours <= 18:
        half = halfstr
    else:
        half = nohalf
        if hours > 18:
            days += 1
    if days < 7:
        return u'%dd' % math.ceil(days)

    # < 4 weeks
    if days < 9:
        return u'1w'
    weeks, wdays = divmod(days, 7)
    if 2 <= wdays <= 4:
        half = halfstr
    else:
        half = nohalf
        if wdays > 4:
            weeks += 1
    if weeks < 4:  # So we don't get 4 weeks
        return u'%dw' % math.ceil(weeks)

    # < year
    if days < 40:
        return u'1mn'
    months, days = divmod(days, 30.4)
    if 10 <= days <= 20:
        half = halfstr
    else:
        half = nohalf
        if days > 20:
            months += 1
    if months < 12:
        return u'%dmn' % math.ceil(months)

    # Don't go further
    if months < 16:
        return u'1y'
    years, months = divmod(months, 12)
    if 4 <= months <= 8:
        half = halfstr
    else:
        half = nohalf
        if months > 8:
            years += 1
    return u'%dy' % math.ceil(years)


# GETTING CURRENT TIME
def get_current_time():
    get_time = str(time.time())
    current_time = get_time.rsplit('.')[0]
    return int(current_time)
