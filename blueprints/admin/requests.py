import uuid

from flask import Blueprint, request

from modules.investment import Investment
from modules.models import Model
from modules.referral import Referral
from modules.settings import Setting
from modules.validations import Validation
from modules.withdrawal import Withdrawal

AdminRequests_page_bp = Blueprint("AdminRequests_page_bp", __name__)
validate = Validation()
invest = Investment()
referral = Referral()
setting = Setting()
model = Model()
withdraw = Withdrawal()


def responseData(data):
    return {"data": data}


@AdminRequests_page_bp.post('/transaction-view-more')
def transaction_view():
    if data := request.get_json():
        res = invest.get_TransactionById(data["id"])
        return responseData(res)


@AdminRequests_page_bp.post('/change-approve-status')
def change_status():
    if data := request.get_json():
        invest.change_TransactionStatus(data["id"], data["status"])
        return "success"


@AdminRequests_page_bp.post('/property-view-more')
def property_view_more():
    if data := request.get_json():
        res = invest.get_PropertyById(data["id"])
        return responseData(res)


@AdminRequests_page_bp.post('/edit-property-details')
def edit_property_details():
    if data := request.get_json():
        res = invest.get_PropertyById(data["id"])
        return responseData(res)


@AdminRequests_page_bp.post('/delete-property')
def delete_property():
    if data := request.get_json():
        if validate.Delete_Property(data["id"]):
            return "success"


@AdminRequests_page_bp.post('/change-disabled-status')
def disabled_status():
    if data := request.get_json():
        setting.ChangeDisabledStatus(data["id"], data["status"])
        return "success"


@AdminRequests_page_bp.post('/change-IsAdmin-status')
def IsAdmin_status():
    if data := request.get_json():
        setting.ChangeIsAdminStatus(data["id"], data["status"])
        return "success"


@AdminRequests_page_bp.post('/individual-details')
def individual_details():
    if data := request.get_json():
        res = validate.UserDetails(data["id"])
        return responseData(res)


@AdminRequests_page_bp.post('/create-new-property')
def create_new_property():
    if request.method == "POST":
        name = request.form["name"]
        state = request.form["state"]
        city = request.form["city"]
        sponsor = request.form["sponsor"]
        invest_type = request.form["invest_type"]
        invest_begins = request.form["invest_begins"]
        invest_ends = request.form["invest_ends"]
        is_closed = request.form["is_closed"]
        irr = request.form["irr"]
        avg_cash_yield = request.form["avg_cash_yield"]
        preferred_return = request.form["preferred_return"]
        equity_multiple = request.form["equity_multiple"]
        minimum_investment = request.form["minimum_investment"]
        minimum_hold_period = request.form["minimum_hold_period"]
        loan_to_cost = request.form["loan_to_cost"]
        distribution_period = request.form["distribution_period"]
        investment_structure = request.form["investment_structure"]
        investment_profile = request.form["investment_profile"]
        properties_type = request.form["properties_type"]
        property_region = request.form["property_region"]
        sample_products = request.form["sample_products"]
        sponsor_experience = request.form["sponsor_experience"]
        sponsor_co_investment = request.form["sponsor_co_investment"]
        repeat_sponsors = request.form["repeat_sponsors"]
        investor_accreditation = request.form["investor_accreditation"]
        exchange = request.form["exchange"]
        opportunity_zone = request.form["opportunity_zone"]
        SD_IRA_eligible = request.form["SD_IRA_eligible"]
        invest_plan = request.form["invest_plan"]
        offering = request.form["offering"]
        description = request.form["desc"]
        investment_summary = request.form["investment_summary"]
        unique_id = str(uuid.uuid4()).replace("-", "")[-14:]

        invest.AddNewProperty(name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr,
                              avg_cash_yield, preferred_return, equity_multiple, minimum_investment,
                              minimum_hold_period,
                              loan_to_cost, distribution_period, investment_structure, investment_profile,
                              properties_type, property_region, sample_products, sponsor_experience,
                              sponsor_co_investment, repeat_sponsors, investor_accreditation, exchange,
                              opportunity_zone,
                              SD_IRA_eligible, invest_plan, offering, description, unique_id, investment_summary)
        res = validate.get_userID_withUniqueID(unique_id)
        setting.process_photo('images[]', res)
        return responseData("success")


@AdminRequests_page_bp.post('/update-edited-property')
def update_edited_property():
    if request.method == "POST":
        name = request.form["name"]
        state = request.form["state"]
        city = request.form["city"]
        sponsor = request.form["sponsor"]
        invest_type = request.form["invest_type"]
        invest_begins = request.form["invest_begins"]
        invest_ends = request.form["invest_ends"]
        is_closed = request.form["is_closed"]
        irr = request.form["irr"]
        avg_cash_yield = request.form["avg_cash_yield"]
        preferred_return = request.form["preferred_return"]
        equity_multiple = request.form["equity_multiple"]
        minimum_investment = request.form["minimum_investment"]
        minimum_hold_period = request.form["minimum_hold_period"]
        loan_to_cost = request.form["loan_to_cost"]
        distribution_period = request.form["distribution_period"]
        investment_structure = request.form["investment_structure"]
        investment_profile = request.form["investment_profile"]
        properties_type = request.form["properties_type"]
        property_region = request.form["property_region"]
        sample_products = request.form["sample_products"]
        sponsor_experience = request.form["sponsor_experience"]
        sponsor_co_investment = request.form["sponsor_co_investment"]
        repeat_sponsors = request.form["repeat_sponsors"]
        investor_accreditation = request.form["investor_accreditation"]
        exchange = request.form["exchange"]
        opportunity_zone = request.form["opportunity_zone"]
        SD_IRA_eligible = request.form["SD_IRA_eligible"]
        invest_plan = request.form["invest_plan"]
        offering = request.form["offering"]
        description = request.form["desc"]
        investment_summary = request.form["investment_summary"]
        id_ = request.form["id"]
        setting.process_photo('images[]', id_)

        if invest.EditProperty(name, state, city, sponsor, invest_type, invest_begins, invest_ends, is_closed, irr,
                               avg_cash_yield, preferred_return, equity_multiple, minimum_investment,
                               minimum_hold_period,
                               loan_to_cost, distribution_period, investment_structure, investment_profile,
                               properties_type, property_region, sample_products, sponsor_experience,
                               sponsor_co_investment, repeat_sponsors, investor_accreditation, exchange,
                               opportunity_zone,
                               SD_IRA_eligible, invest_plan, offering, description, id_, investment_summary):
            return responseData("success")
