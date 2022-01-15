// noinspection HtmlUnknownAttribute


$(document).ready(function () {

    let body = $("body");

    let app_name = body.find("[app-page]");

    let url = window.location.href;

    // Removing any symbol or regex
    // (E.g ? or =) symbol at the end of the page link
    let page = url.slice(url.lastIndexOf("/") + 1).replace(/[^a-z0-9\s]/gi, '');

    // Custom ajax request for choosing if request
    // should contain json data or not.
    let AjaxSubmit = (url, type, data, isJson) => {
        if (isJson === true) {
            return $.ajax({
                url: url,
                type: type,
                contentType: "application/json",
                data: JSON.stringify(data),
                cache: false,
                processData: false,
            });
        } else if (isJson === false) {
            return $.ajax({
                url: url,
                type: type,
                data: data,
                contentType: false,
                cache: false,
                processData: false
            });
        }
    }

    let CustomAlert = (alert_type, message) => {

        if (alert_type === "default") {
            body.append('        <div class="Toastify__toast-container Toastify__toast-container--top-center">\n' +
                '            <div id="mtyiglv867" class="Toastify__toast Toastify__toast--' + alert_type + '"\n' +
                '                 style="animation-fill-mode: forwards; animation-duration: 750ms;">\n' +
                '                <div role="alert" class="Toastify__toast-body"> ' + message + ' \n' +
                '                </div>\n' +
                '                <button class="Toastify__close-button Toastify__close-button--error" type="button" aria-label="close">\n' +
                '                    <svg aria-hidden="true" viewBox="0 0 14 16">\n' +
                '                        <path fill-rule="evenodd"\n' +
                '                              d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path>\n' +
                '                    </svg>\n' +
                '                </button>\n' +
                '                <div class="Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar--default" style="opacity: 1;"></div>\n' +
                '            </div>\n' +
                '        </div>\n');
        } else {
            body.append('        <div class="Toastify__toast-container Toastify__toast-container--top-center">\n' +
                '            <div id="mtyiglv867" class="Toastify__toast Toastify__toast--' + alert_type + '"\n' +
                '                 style="animation-fill-mode: forwards; animation-duration: 750ms;">\n' +
                '                <div role="alert" class="Toastify__toast-body"> ' + message + ' \n' +
                '                </div>\n' +
                '                <button class="Toastify__close-button Toastify__close-button--error" type="button" aria-label="close">\n' +
                '                    <svg aria-hidden="true" viewBox="0 0 14 16">\n' +
                '                        <path fill-rule="evenodd"\n' +
                '                              d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path>\n' +
                '                    </svg>\n' +
                '                </button>\n' +
                '                <div class="Toastify__progress-bar Toastify__progress-bar--error"\n' +
                '                     style="opacity: 1;"></div>\n' +
                '            </div>\n' +
                '        </div>\n');
        }


        let Toastify = body.find(".Toastify__toast-container");

        let Toastify_progress_bar = Toastify.find(".Toastify__progress-bar");

        setTimeout(function () {
            Toastify.remove();
        }, 5000);

        let toastWidth = 100;
        let val = 0;
        let roll = setInterval(progress, val)

        function progress() {
            if (toastWidth <= val) {
                clearInterval(roll)
            } else {
                toastWidth--
                Toastify_progress_bar.animate({
                    width: toastWidth + "%"
                }, 27)
            }
        }

        Toastify.on("click", function () {
            $(this).remove();
        });
    };

    // Making a page navigation link active
    // base on the current page the user visit
    let changeURLCss = () => {
        let sidebar_menu = body.find("#sidebar_menu");

        switch (page) {
            case "AppAdmin":
                body.attr("app-page", page);
                sidebar_menu.find("[href='/AppAdmin']").addClass("active");
                break;
            case "transactions":
                body.attr("app-page", page);
                sidebar_menu.find("[href='/AppAdmin/transactions']").addClass("active");
                break;
            case "users":
                sidebar_menu.find("[href='/AppAdmin/users']").addClass("active");
                body.attr("app-page", page)
                break;
            case "property":
                sidebar_menu.find("[href='/AppAdmin/property']").addClass("active");
                body.attr("app-page", page)
                break;
            default:
                console.log("page is not available")

        }
    };

    // All script for the transaction page
    let Transaction_ = () => {

        //This CARD lets you view more details on each of the transaction
        let ViewMore = (email, name, plan, amount, status, roi, due_date, wallet_address) => {
            return `<div class="confirm_receipt" confirm_receipt>
            <div class="box" confirm_box>
                <div class="title">Transaction Details
                    <div class="btns">
                        <button class="cancel" close_receipt>Close</button>
                    </div>
                </div>
                <div class="confirmation" confirmation>
                    <div class="des_box">
                        <p class="name">Email</p>
                        <p class="value">${email}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Property Name</p>
                        <p class="value">${name}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Plan</p>
                        <p class="value">${plan}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Amount</p>
                        <p class="value">$${amount}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Status</p>
                        <p class="value">${status}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">REIT</p>
                        <p class="value">$${roi}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Payee WalletAddress</p>
                        <p class="value">${wallet_address}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">Due Date</p>
                        <p class="value">${due_date}</p>
                    </div>
    
    
                </div>
            </div>
        </div>`
        }


        // Assigning values to the ticket status automatically
        setInterval(function () {
            body.find("[ChangeStatus]").each(function () {
                $(this).find(`[value='${$(this).attr("value")}']`).attr("selected", "selected")
            })
        }, 100);

        //View more transaction details
        body.on("click", "[view_more]", function () {
            let $this = $(this);
            let id = $this.attr("id");
            let data = {
                "id": id
            }
            AjaxSubmit("/transaction-view-more", "POST", data, true).then(function (data) {
                let res = data["data"];
                body.append(ViewMore(res["email"], res["name"], res["plan"], res["amount"], res["status"], res["roi"], res["expiration"], res["wallet_address"]))
            });

        });

        // close the view more transaction details
        body.on("click", "[close_receipt]", function (e) {
            body.find("[confirm_receipt]").remove();
        });

        // changing the status of the ticket slip
        body.on("change", "[ChangeStatus]", function () {
            let $this = $(this);
            let value = $this.val();
            let id = $this.attr("id");
            let data = {"id": id, "status": value};
            AjaxSubmit("/change-approve-status", "POST", data, true).then(function (data) {
                if (data === "success") {
                    CustomAlert("success", `Ticket status has been changed successfully to ${value}`);
                }

            });
        });

    };

    // All scripts for the user page
    let users_ = () => {

        //This CARD lets you view more details about each user
        let ViewMore = (firstname, lastname, email, gender, ssn, phone, total_invest, contact_address, country) => {
            return `<div class="confirm_receipt" confirm_receipt>
            <div class="box" confirm_box>
                <div class="title">User Details
                    <div class="btns">
                        <button class="cancel" close_receipt>Close</button>
                    </div>
                </div>
                <div class="confirmation" confirmation>
                    <div class="des_box">
                        <p class="name">firstname</p>
                        <p class="value">${firstname}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">lastname</p>
                        <p class="value">${lastname}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">email</p>
                        <p class="value">${email}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">gender</p>
                        <p class="value">${gender}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">SSN/ Tax ID</p>
                        <p class="value">${ssn}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">phone</p>
                        <p class="value">${phone}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">total investment</p>
                        <p class="value">${total_invest}</p>
                    </div>
                    <div class="des_box">
                        <p class="name">My address</p>
                        <p class="value">${contact_address}</p>
                    </div>   
                    <div class="des_box">
                        <p class="name">Country</p>
                        <p class="value">${country}</p>
                    </div>
    
    
                </div>
            </div>
        </div>`
        }

        // Assigning values to the users ban status automatically

        setInterval(function () {
            body.find("[ChangeStatus]").each(function () {
                $(this).find(`[value='${$(this).attr("value")}']`).attr("selected", "selected")
            });
        }, 100);

        // Assigning values to the user admin status automatically

        setInterval(function () {
            body.find("[isAdmin]").each(function () {
                $(this).find(`[value='${$(this).attr("value")}']`).attr("selected", "selected");
            });
        }, 100)

        //View more user view details
        body.on("click", "[view_more]", function () {
            let $this = $(this);
            let id = $this.attr("id");
            let data = {
                "id": id
            }
            AjaxSubmit("/individual-details", "POST", data, true).then(function (data) {
                let res = data["data"];
                body.append(ViewMore(res["firstname"], res["lastname"], res["email"], res["gender"], res["ssn"], res["phone"], res["total_investements"], res["contact_address"], res["country"]))
            });

        });

        // close the view more user details details
        body.on("click", "[close_receipt]", function (e) {
            body.find("[confirm_receipt]").remove();
        });

        // changing the disabled option on users
        body.on("change", "[ChangeStatus]", function () {
            let $this = $(this);
            let value = $this.val();
            let id = $this.attr("id");
            let data = {"id": id, "status": value};
            AjaxSubmit("/change-disabled-status", "POST", data, true).then(function (data) {
                if (data === "success") {
                    CustomAlert("success", `This user disabled status has been successfully changed to ${value}`);
                }

            });
        });

        // changing the IsAdmin option on users
        body.on("change", "[isAdmin]", function () {
            let $this = $(this);
            let value = $this.val();
            let id = $this.attr("id");
            let data = {"id": id, "status": value};
            AjaxSubmit("/change-IsAdmin-status", "POST", data, true).then(function (data) {
                if (data === "success") {
                    CustomAlert("success", `This user IsAdmin status has been successfully changed to ${value}`);
                }

            });
        });


    };

    // All scripts for the properties page
    let properties = () => {

        // Automatically adding some scripts to the property file
        let AddProperties = () => {
            $("head").append('<link type="text/css" rel="stylesheet" href="/static/admin/css/image-uploader.min.css">');
            $("head").append('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
            $("body").append('<script type="text/javascript" src="/static/admin/js/image-uploader.min.js"></script>');
        }

        AddProperties();

        // Script that allows admin upload a new property
        let propertyUplaod = () => {
            let image_upload = body.find('.image-upload');
            image_upload.imageUploader({
                label: 'Upload property photos (maximum of 3 photos)',
                maxfiles: 3,
                extensions: ['.jpg', '.jpeg', '.png', '.svg'],
                preloadedInputName: "sinclair"
            });
        }

        setInterval(function () {
            body.find("select").each(function () {
                $(this).find(`[value='${$(this).attr("value")}']`).attr("selected", "selected");
            });
        }, 100)

        //View property
        body.on("click", "[view_more]", function () {
            let $this = $(this);
            let id = $this.attr("id");
            let data = {
                "id": id
            }
            $this.html("Wait..").prop("disabled", true);
            AjaxSubmit("/property-view-more", "POST", data, true).then(function (data) {
                let res = data["data"];
                let result = ""
                for (let x in res) {
                    if (res.hasOwnProperty(x)) {
                        result += `     <div class="des_box">
                                <p class="name">${x}</p>
                                <p class="value">${res[x]}</p>
                            </div>`
                    }
                }
                body.append(
                    `<div class="confirm_receipt" confirm_receipt>
                    <div class="box" confirm_box>
                        <div class="title">Property Details
                            <div class="btns">
                                <button class="cancel" close_receipt>Close</button>
                            </div>
                        </div>
                        <div class="confirmation" confirmation>
                            ${result}
                        </div>
                    </div>
                </div>`
                )
            });

        });

        // close the view more transaction details
        body.on("click", "[close_receipt]", function (e) {
            body.find("[confirm_receipt]").remove();
        });

        // deleting property rows
        body.on("click", "[delete]", function (e) {
            e.preventDefault();
            let tablerow = $(this);
            let table = $(".lms_table_active3 ").DataTable();

            let id = tablerow.attr("id");
            let sent_data = {
                "id": id
            }
            swal({
                title: "Warning!",
                text: "Are you sure, you want to delete this property ?",
                icon: "warning",
                buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                ]
            }).then(function (isCofirm) {
                if (isCofirm) {
                    swal({
                        title: "Deleted",
                        text: "This property has been deleted!",
                        icon: "success"
                    }).then(function () {
                        AjaxSubmit("/delete-property", "POST", sent_data, true).then(function (res) {
                            if (res === "success") {
                                table.row(tablerow.parents('tr')).remove().draw();
                            } else {
                                swal("Error", "Unable to delete property", "error");
                            }
                        })
                    })
                } else {
                    swal("Cancelled", "The property is safe :)", "error");
                }
            });
        });

        // create a new property new pop form
        body.on("click", "[add_property]", function (e) {
            e.preventDefault();
            body.find(".confirm_receipt").css("display", "flex");
        });

        // close the  new property new pop form
        body.find("[AddProperty]").on("click", "[close_property]", function (e) {
            body.find("[AddProperty]").fadeOut("300");
        });


        //sending new property forms
        body.find("[newpropertyform]").on("submit", function (e) {
            e.preventDefault();
            let form = new FormData(this);
            let btn = $(this);
            btn.find("button").html("Adding Property...").prop("disabled", true);
            AjaxSubmit('/create-new-property', "POST", form, false).then(function (result) {
                let data = result["data"]
                btn.find("button").html("UPLOAD PROPERTY").prop("disabled", false);
                if (data === "success") {
                    swal({
                        title: "Uploaded!",
                        text: "Do you want to add another property ?",
                        icon: "success",
                        buttons: [
                            'No, i am done!',
                            'Yes, i want to!'
                        ]
                    }).then(function (isCofirm) {
                        if (!isCofirm) {
                            location.reload();
                        }
                    });
                }
            })

        });


        //edit property
        body.on("click", "[edit_property]", function () {
            let $this = $(this);
            let id = $this.attr("id");
            let data = {
                "id": id
            }
            AjaxSubmit("/edit-property-details", "POST", data, true).then(function (data) {
                let res = data["data"];

                body.append(`
                    <div class="confirm_receipt " confirm_receipt style="display: flex;">
          <div class="box" confirm_box="">
            <div class="title">New Property
                <div class="btns">
                    <button class="cancel" close_receipt>Close</button>
                </div>
            </div>
            <div class="confirmation property_box" confirmation="">
                <form enctype="multipart/form-data" updatepropertyform>
                    <div class="image-upload"></div>

                    <div class="forms_">


                        <div class="box_">
                            <label>Property Name</label>
                            <input type="text" name="name" value="${res["name"]}" required="">
                        </div>

                        <div class="box_">
                            <label>Property State</label>
                            <input type="text" name="state" value="${res["state"]}" required="">
                        </div>

                        <div class="box_">
                            <label>Property City</label>
                            <input type="text" name="city" required="" value="${res["city"]}">
                        </div>

                        <div class="box_">
                            <label>Property Sponsor</label>
                            <input type="text" name="sponsor" required="" value="${res["sponsor"]}">
                        </div>

                        <div class="box_">
                            <label>Investment Type</label>
                            <select name="invest_type" required="" value="${res["invest_type"]}">
                                <option value="Individual Deals">Individual Deals</option>
                                <option value="Funds &amp; Vehicles">Funds &amp; Vehicles</option>
                                <option value="Tailored Portfolio">Tailored Portfolio</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Investment Begins</label>
                            <input type="date" name="invest_begins" required="" value="${res["invest_begins"]}">
                        </div>
                        <div class="box_">
                            <label>Investment Ends</label>
                            <input type="date" name="invest_ends" required="" value="${res["invest_ends"]}">
                        </div>

                        <div class="box_">
                            <label>Investment is Closed ?</label>
                            <select name="is_closed" required="" value="${res["is_closed"]}">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>IRR (%)</label>
                            <input type="text" name="irr" value="${res["irr"]}">
                        </div>

                        <div class="box_">
                            <label>Average Cash Yield (%)</label>
                            <input type="text" name="avg_cash_yield" value="${res["avg_cash_yield"]}">
                        </div>

                        <div class="box_">
                            <label>Preferred Return (%)</label>
                            <input type="text" name="preferred_return" value="${res["preferred_return"]}">
                        </div>

                        <div class="box_">
                            <label>Equity Multiple (x)</label>
                            <input type="text" name="equity_multiple" value="${res["equity_multiple"]}">
                        </div>

                        <div class="box_">
                            <label>Minimum Investment ($)</label>
                            <input type="number" name="minimum_investment" value="${res["minimum_investment"]}">
                        </div>

                        <div class="box_">
                            <label>Minimum Hold Period (Years)</label>
                            <input type="number" name="minimum_hold_period" value="${res["minimum_hold_period"]}">
                        </div>

                        <div class="box_">
                            <label>Loan To Cost (%)</label>
                            <input type="number" name="loan_to_cost" value="${res["loan_to_cost"]}">
                        </div>

                        <div class="box_">
                            <label>Distribution Period</label>
                            <select name="distribution_period" value="${res["distribution_period"]}">
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Semi Annually">Semi Annually</option>
                                <option value="Annually">Annually</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Investment Structure</label>
                            <select name="investment_structure" value="${res["investment_structure"]}">
                                <option value="Debt">Debt</option>
                                <option value="Equity">Equity</option>
                                <option value="Mezzanine Debt">Mezzanine Debt</option>
                                <option value="Portfolio">Portfolio</option>
                                <option value="REIT">REIT</option>
                                <option value="Preferred Equity">Preferred Equity</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Investment Profile</label>
                            <select name="investment_profile" value="${res["investment_profile"]}">
                                <option value="Core">Core</option>
                                <option value="Core Plus">Core Plus</option>
                                <option value="Value Add">Value Add</option>
                                <option value="Opportunistic">Opportunistic</option>
                                <option value="Development">Development</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Properties Type</label>
                            <select name="properties_type" value="${res["properties_type"]}">
                                
                                    <option value="Flex">Flex</option>
                                
                                    <option value="Hospitality">Hospitality</option>
                                
                                    <option value="Industrial">Industrial</option>
                                
                                    <option value="Land">Land</option>
                                
                                    <option value="Medical Office">Medical Office</option>
                                
                                    <option value="Mixed Use">Mixed Use</option>
                                
                                    <option value="Multi-Asset">Multi-Asset</option>
                                
                                    <option value="Multifamily">Multifamily</option>
                                
                                    <option value="Office">Office</option>
                                
                                    <option value="Residential">Residential</option>
                                
                                    <option value="Retail">Retail</option>
                                
                                    <option value="Senior Housing">Senior Housing</option>
                                
                                    <option value="Storage">Storage</option>
                                
                                    <option value="Student Housing">Student Housing</option>
                                
                                    <option value="Manufactured Housing">Manufactured Housing</option>
                                
                                    <option value="Built-to-Rent">Built-to-Rent</option>
                                
                                    <option value="Flex/Office">Flex/Office</option>
                                
                                    <option value="Data Center">Data Center</option>
                                
                                    <option value="Parking Garage">Parking Garage</option>
                                
                                    <option value="Co-Living">Co-Living</option>
                                
                                    <option value="Specialty">Specialty</option>
                                
                            </select>
                        </div>


                        <div class="box_">
                            <label>Property Region</label>
                            <select name="property_region" value="${res["property_region"]}">
                                
                                    <option value="East">East</option>
                                
                                    <option value="West">West</option>
                                
                                    <option value="Midwest">Midwest</option>
                                
                                    <option value="South">South</option>
                                
                                    <option value="Multiple Regions">Multiple Regions</option>
                                
                            </select>
                        </div>

                        <div class="box_">
                            <label>sample Products</label>
                            <select name="sample_products" value="${res["sample_products"]}">
                                <option value="sample Product">sample Product</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Sponsor Experience</label>
                            <select name="sponsor_experience" value="${res["sponsor_experience"]}">
                                
                                    <option value="Emerging">Emerging</option>
                                
                                    <option value="Seasoned">Seasoned</option>
                                
                                    <option value="Tenured">Tenured</option>
                                
                                    <option value="Enterprise">Enterprise</option>
                                
                            </select>
                        </div>

                        <div class="box_">
                            <label>Sponsor Co-Investment (%)</label>
                            <input type="number" name="sponsor_co_investment" value="${res["sponsor_co_investment"]}">
                        </div>

                        <div class="box_">
                            <label>Repeat Sponsors</label>
                            <select name="repeat_sponsors" value="${res["repeat_sponsors"]}">
                                <option value="Only repeat sponsors">Only repeat sponsors</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Investor Accreditation</label>
                            <select name="investor_accreditation" value="${res["investor_accreditation"]}">
                                
                                    <option value="Accredited Investors Only">Accredited Investors Only</option>
                                
                                    <option value="Non Accredited Eligible">Non Accredited Eligible</option>
                                
                            </select>
                        </div>

                        <div class="box_">
                            <label>Exchange</label>
                            <select name="exchange" value="${res["exchange"]}" >
                                <option value="1031 eligible">1031 eligible</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Opportunity Zone</label>
                            <select name="opportunity_zone" value="${res["opportunity_zone"]}">
                                <option value="1031 eligible">Opportunity Zone eligible</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>SD IRA Eligible</label>
                            <select name="SD_IRA_eligible" value="${res["SD_IRA_eligible"]}">
                                <option value="SD IRA Eligible">SD IRA Eligible</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label> Investment Plan</label>
                            <select name="invest_plan" required="" value="${res["invest_plan"]}">
                                <option value="Bronze">Bronze</option>
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Offering</label>
                            <select name="offering" required="" value="${res["offering"]}">
                                <option value="funded offering">funded offering</option>
                                <option value="current offering">current offering</option>
                            </select>
                        </div>

                        <div class="box_">
                            <label>Property Description</label>
                            <textarea name="desc" required="" style="height: 50px" >${res["desc"]}</textarea>
                        </div>      
                         <div class="box_">
                            <label>Investment Summary</label>
                            <textarea name="investment_summary" required="" style="height: 50px" >${res["investment_summary"]}</textarea>
                        </div>
                    </div>
                    <div class="submission">
                        <button type="submit" id="${res["id"]}" update_submit>Upload Property</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
                `);

                let images = []
                let props_ = res["property_image"]
                if (props_ !== "empty") {
                    for (let a in props_) {
                        if (props_.hasOwnProperty(a)) {
                            images.push({id: parseInt(a), src: `/static/private_/houses/${res["id"]}/${props_[a]}`})
                        }
                    }
                    $('.image-upload').imageUploader({
                        preloaded: images
                    });
                } else {
                    $('.image-upload').imageUploader();
                }

            });

        });

        //update after editing the property
        //sending new property forms
        body.on("submit", "[updatepropertyform]", function (e) {
            e.preventDefault();
            let form = new FormData(this);
            form.append("id", body.find("[update_submit]").attr("id"))
            let btn = $(this);
            btn.find("button").html("Editing Property...").prop("disabled", true);
            AjaxSubmit('/update-edited-property', "POST", form, false).then(function (result) {
                let data = result["data"]
                btn.find("button").html("UPLOAD PROPERTY").prop("disabled", false);
                if (data === "success") {
                    swal({
                        title: "Property Edited!",
                        text: "Do you want to edit it again?",
                        icon: "success",
                        buttons: [
                            'No, i am done!',
                            'Yes, i want to!'
                        ]
                    }).then(function (isCofirm) {
                        if (!isCofirm) {
                            location.reload();
                        }
                    });
                }
            })

        });

        propertyUplaod();


    };

    changeURLCss();

    // Switching each particular script to run
    // on it specifically assigned page
    switch (body.attr("app-page")) {
        case "transactions":
            Transaction_();
            break;
        case "users":
            users_();
            break;
        case "property":
            properties();
            break;
        default:
            console.log("Check the general.js for debugging..")
    }
});
