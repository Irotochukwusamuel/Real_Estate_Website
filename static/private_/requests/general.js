// noinspection HtmlUnknownAttribute

$(document).ready(function () {

    let body = $("body");

    let app_name = body.find("[app-data]");

    // let url = window.location.href;

    // let page = url.slice(url.lastIndexOf("/") + 1);

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

    // Custom Ajax submit request
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

    let ringRotateCard = () => {
        return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>'
    }

    // CHANGE PROFILE PHOTO
    let ProfilePhoto = () => {
        let ChangePF = body.find("[name='pf']");
        body.on("change", "[name='pf']", function () {
            if (this.files) $.each(this.files, readAndPreview);

            function readAndPreview(i, file) {
                if (!/\.(jpe?g|png)$/i.test(file.name)) {
                    return CustomAlert("error", file.name + " " + "is not an image");
                }
                let reader = new FileReader();

                $(reader).on("load", function () {
                    let image_data = this.result.replace("data:" + file.type + ";base64,", '');
                    let data = {
                        "pf": image_data
                    };
                    ChangePF.prev("[pfbtn]").prop("disabled", true).html("please wait..");
                    AjaxSubmit("/profilephoto", "POST", data, true).then(function (data) {
                        if (data["data"][0] === "success") {
                            ChangePF.prev("[pfbtn]").prop("disabled", false).html("Change Picture");
                            body.find("[pf_img]").attr("src", reader.result);
                            CustomAlert("success", "your display photo has been changed successfully")
                        }
                    });
                });
                reader.readAsDataURL(file);
            }


        });
    };

    // CHANGE PASSWORD
    let ChangePassword = () => {
        let changepassword = body.find('[changepassword]');

        let CheckPasswordValidate = () => {
            let password = body.find("#password");
            let cpassword = body.find("#cpassword");


            if (password.val().trim() !== cpassword.val().trim()) {
                CustomAlert("warning", "Password does not match!");
                return false
            } else if (password.val().trim().length <= 5) {
                CustomAlert("warning", "Password must be more 5 digits");
                return false
            }
            return true
        }

        body.on("submit", "[changepassword]", function (e) {
            e.preventDefault();
            let data = new FormData(this)
            if (CheckPasswordValidate()) {
                AjaxSubmit("/changepassword", "POST", data, false).then(function (data) {
                    let result = data["data"];
                    if (result[0] === "success") {
                        CustomAlert(result[0], result[1])
                        setTimeout(function () {
                            window.location.href = "/login"
                        }, 3000)
                    } else {
                        CustomAlert(result[0], result[1])
                    }

                });
            }

        })
    };

    // CHANGE EMAIL
    let ChangeEmail = () => {

        body.on("submit", '[changeemail]', function (e) {
            e.preventDefault();
            let data = new FormData(this)

            AjaxSubmit("/changeemail", "POST", data, false).then(function (data) {
                let result = data["data"];
                if (result[0] === "success") {
                    CustomAlert(result[0], result[1])
                    setTimeout(function () {
                        window.location.href = "/login"
                    }, 3000)
                } else {
                    CustomAlert(result[0], result[1])

                }

            });


        })
    };

    // MY PROFILE CARDS
    let Profile_card = () => {

        let change_image = (image) => {
            return `<div class="col-span-12 lg:col-span-8 xxl:col-span-9"><div class="intro-y box lg:mt-2" style="min-height: 65vh;"><div class="flex items-center p-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2 text-theme-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Update Profile Picture</h2></div><div class="p-3"><div class="grid grid-cols-12 gap-3"><div class="col-span-12 xl:col-span-12"><div class="border border-gray-200 rounded-md p-3"><div class="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto"><img class="rounded-md" alt="kelvin" src="${image}" pf_img></div><div class="w-40 mx-auto cursor-pointer relative mt-2"><button type="button" class="button w-full bg-theme-1 text-white" pfbtn><span>Change Picture</span></button><input type="file" accept="image/*" name="pf" class="w-full h-full top-0 left-0 absolute opacity-0"></div></div></div></div></div></div></div>`
        };

        let update = (a, b, c, d, e, f, h) => {
            return `<div class="col-span-12 lg:col-span-8 xxl:col-span-9"><form updateForm><div class="intro-y box lg:mt-2" style="min-height: 66vh;"><div class="flex items-center p-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2 text-theme-1"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Account Setting</h2></div><div class="p-3"><div class="grid grid-cols-12 gap-3"><div class="col-span-12 xl:col-span-6"><div><label>Firstname</label><input type="text" class="input w-full border mt-2" placeholder="Firstname" value="${a}" name="firstname" required></div><div class="mt-3"><label>Email Address</label><input type="text" class="input w-full border bg-gray-100 cursor-not-allowed mt-2" placeholder="Enter your email" disabled="" value="${b}" name="email" required></div><div class="mt-3"><label>Select Gender</label><select class="input w-full border mt-2" name="gender" required ><option value="Male" >Male</option><option value="Female">Female</option><option value="Other">Others</option></select></div><div class="mt-3"><label>SSN/ Tax ID</label><input type="text" class="input w-full border   mt-2" placeholder="SSN/Tax ID" value="${d}" name="ssn" ></div></div><div class="col-span-12 xl:col-span-6"><div><label>Lastname</label><input type="text" class="input w-full border mt-2" placeholder="Lastname" value="${e}" name="lastname"  required></div><div class="mt-3"><label>Phone</label><input type="text" class="input w-full border mt-2" placeholder="Enter Phone" value="${f}" name="phone" required ></div><div class="mt-3"><label>Contact Address</label><textarea class="input w-full border mt-2" placeholder="Enter Contact Address" name="contact" required>${h}</textarea></div></div></div><div class="flex justify-end mt-4"><button type="submit" class="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Changes</button></div></div></div></form></div>`
        };

        let next_of_kin = (a, b, c, d, image) => {
            return `<div class="col-span-12 lg:col-span-8 xxl:col-span-9"><form updatenextkin><div class="intro-y box lg:mt-2" style="min-height: 66vh;"><div class="flex items-center p-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2 text-theme-1"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M376 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M288 304c-87 0-175.3 48-191.64 138.6-2 10.92 4.21 21.4 15.65 21.4H464c11.44 0 17.62-10.48 15.65-21.4C463.3 352 375 304 288 304z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M88 176v112m56-56H32"></path></svg> Next of Kin</h2></div><div class="p-3"><div class="grid grid-cols-12 gap-3"><div class="col-span-12 xl:col-span-8"><div><label>Name</label><input type="text" required class="input w-full border mt-2" placeholder="Enter name" value="${a}" name="name"></div><div class="mt-3"><label>Email Address</label><input type="email" required class="input w-full border mt-2" placeholder="Enter your email" value="${b}" name="email"></div><div class="mt-3"><label>Relationship to next of kin</label><select required placeholder="Relationship to next of kin" class="input w-full border mt-2" name="relationship"><option value="Father">Father</option><option value="Mother">Mother</option><option value="Brother">Brother</option><option value="Sister">Sister</option><option value="Son">Son</option><option value="Daughter">Daughter</option><option value="Relation">Relation</option></select></div><div class="mt-3"><label>Phone</label><input type="text" required class="input w-full border mt-2" placeholder="Enter Phone" value="${d}" name="phone"></div></div><div class="col-span-12 xl:col-span-4"><div><div class="grid grid-cols-12 gap-3"><div class="col-span-12 xl:col-span-12"><div class="border border-gray-200 rounded-md p-3"><div class="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto"><img class="rounded-md" alt="next" src="${image}" kin_display_photo></div><div class="w-40 mx-auto cursor-pointer relative mt-2"><button type="button" class="button w-full bg-theme-1 text-white" change_kin_pf_btn><span>Change Picture</span></button><input type="file" accept="image/*" class="w-full h-full top-0 left-0 absolute opacity-0" name="change_kin_pf_inp" change_kin_pf_inp></div></div></div></div></div><div class="mt-3"></div></div></div><div class="flex justify-end mt-4"><button type="submit"  class="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Changes</button></div></div></div></form></div>`
        };

        let change_password = () => {
            return `<div class="col-span-12 lg:col-span-8 xxl:col-span-9"><form changepassword><div class="intro-y box lg:mt-2" style="min-height: 66vh;"><div class="flex items-center p-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2 text-theme-1"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>Change Password</h2></div><div class="p-3"><div><label>Current Password</label><input type="password" class="input w-full border mt-2" placeholder="Current Password" name="current" value required></div><div class="mt-3"><label>New Password</label><input type="password" class="input w-full border mt-2" placeholder="New Password" required name="new" value id="password"></div><div class="mt-3"><label>Confirm Password</label><input type="password" class="input w-full border mt-2" placeholder="Confirm Password" id="cpassword" value required></div><button type="submit" class="button bg-theme-1 text-white mt-4">Change Password</button></div></div></form></div>`
        };

        let change_email = () => {
            return `<div class="col-span-12 lg:col-span-8 xxl:col-span-9"><form changeemail><div class="intro-y box lg:mt-2" style="min-height: 65vh;"><div class="flex items-center p-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2 text-theme-1"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg> Change Email</h2></div><div class="p-3"><div><label>Email Address</label><input required type="email" class="input w-full border mt-2" placeholder="Email Address" value name="email" ></div><button type="submit" class="button bg-theme-1 text-white mt-4">Submit</button></div></div></form></div>`
        };

        return {
            change_password: change_password,
            update: update,
            change_image: change_image,
            next_of_kin: next_of_kin,
            change_email: change_email
        }
    };

    let loader2 = () => {
        return '<div class="lds-ring lds-ring-themed mt-5 undefined"><div></div><div></div><div></div><div></div></div>'
    }

    let page_loader = () => {
        return `
        <div id="ftco-loader" class="show fullscreen" page_loader>
             <svg class="circular" width="48px" height="48px">
                <circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/>
                <circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10"
                stroke="#F96D00"/>
            </svg>
        </div>`
    }

    let remove_loader = () => {
        setTimeout(function () {
            return body.find("[page_loader]").remove();
        }, 1000)

    }

    // Marketplace page script
    let marketplace = () => {

        let CurrNavMediaQuery = () => {
            if (window.matchMedia('(max-width : 480px)').matches) {
                $(".desktop_nav").removeAttr("InvestmentType_tabs");
                $(".mobile_nav").attr("InvestmentType_tabs", "InvestmentType_tabs");
            } else {
                $(".desktop_nav").attr("InvestmentType_tabs", "InvestmentType_tabs");
                $(".mobile_nav").removeAttr("InvestmentType_tabs");
            }
        };

        let InvestmentTypeNavs = () => {
            let invest_tabs = body.find("[InvestmentType_tabs]").find("li");

            invest_tabs.each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    //uncheck all radios while switching to another tab
                    body.find(".filter--selection").find("input").prop("checked", false);
                    body.find("[data-column-count]").addClass("d-none").text(" ");
                    let res = $(this).find("[nav_data]").attr("nav_data");
                    let panel = body.find(".tab-content").find(`#${res.toLowerCase()}`);
                    let container = panel.find("[data-open]");
                    let data = {
                        "data": $(this).text().trim()
                    }
                    body.append(page_loader());
                    if (res !== "all" && res !== "favourites") {
                        container.empty();
                        AjaxSubmit("/filter-investment-type", "POST", data, true).then(function (result) {
                            let data = result["data"];
                            remove_loader();
                            if (data !== "empty") {
                                for (let i = 0; i < data.length; i++) {
                                    let a = data[i];
                                    let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                                    if (!container.hasClass("grid-box")) {
                                        container.addClass("grid-box");
                                    }
                                    //appending properties
                                    container.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}" >
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                                }
                            } else {
                                container.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                            }

                        });

                    } else if (res === "favourites") {
                        container.empty();
                        AjaxSubmit("/my-favourite-properties", "POST", 'empty', false).then(function (result) {
                            let data = result["data"];
                            remove_loader();
                            if (data !== "empty") {
                                for (let i = 0; i < data.length; i++) {
                                    let a = data[i];
                                    let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                                    if (!container.hasClass("grid-box")) {
                                        container.addClass("grid-box")
                                    }
                                    if (a[8] === "Yes") {
                                        container.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="grid-card-alert p-2 display-7" style="pointer-events: none;cursor:default">
                                            <p class="m-0 p-0 col-7 m-auto">
                                                Closed: ${a[7]}
                                            </p>
                                        </div>
                                      </a>
                                `);
                                    } else {
                                        container.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                                    }
                                }
                            } else {

                                container.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                            }
                        });

                    } else if (res === "all") {
                        window.location.reload();
                    }


                });
            });
        };

        let favourites = () => {
            let fav_btn = body.find("[fav_btn]");
            let favourite_tab = body.find("[favourite_tab]");
            let container = body.find("[favourite_menu]").find("[data-open]");

            // favouriting properties
            body.on("click", "[fav_btn]", function (e) {
                e.preventDefault();
                let parent_ = $(this).parents(".grid-card").attr('property_id');

                if (!$(this).hasClass("active")) {
                    $(this).addClass('active ri-heart-fill').removeClass("ri-heart-line").css("color", "red");
                    let data = {"id": parent_, "type": "add"}
                    AjaxSubmit("/favourite-property", "POST", data, true).then(function (result) {
                        CustomAlert("success", "You have added one property to favourite");
                    });
                } else {
                    $(this).removeClass('active ri-heart-fill').addClass("ri-heart-line").css("color", "black");
                    let data = {"id": parent_, "type": "remove"}
                    let favourited = $(this).parents("[property_id]");
                    if (favourited.length > 0) {
                        if (!container.hasClass("grid-box")) {
                            container.addClass("grid-box")
                        }
                        container.find(favourited).remove();
                    } else {
                        container.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                    }
                    AjaxSubmit("/favourite-property", "POST", data, true).then(function (result) {
                        CustomAlert("success", "You have removed one property from favourite");

                    });
                }
            });


        };

        let filterBox = () => {
            let parent_id = body.find("form[parent_id]");

            //GETTING THE FILTERS VALUES
            parent_id.find("[type='radio']").on("click", function () {
                let properties_features = {}
                $("input[type='radio']:checked").each(function () {
                    let filter_val = $(this).attr("id");
                    let get_parent = $(this).parents("form[parent_id]").attr("parent_id");
                    properties_features[get_parent] = filter_val
                });
                let nav = body.find("[investmenttype_tabs]").find(".nav-link.active");
                let curr_nav = nav.text().trim();
                let id_attr = nav.attr("nav_data");
                let panel = body.find(".tab-content").find(`#${id_attr.toLowerCase()}`);
                let property_box = panel.find("[data-open]");
                let data = {
                    "data": properties_features,
                    "curr_nav": curr_nav
                }
                property_box.empty();
                if (!property_box.hasClass("grid-box")) {
                    property_box.addClass("grid-box");
                }
                body.append(page_loader());
                AjaxSubmit("/filter-properties-sub", "POST", data, true).then(function (result) {
                    let data = result["data"]
                    remove_loader();

                    if (data !== "empty") {
                        for (let i = 0; i < data.length; i++) {
                            let a = data[i];
                            let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                            //appending properties
                            if (a[8] === "Yes") {
                                property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="grid-card-alert p-2 display-7" style="pointer-events: none;cursor:default">
                                            <p class="m-0 p-0 col-7 m-auto">
                                                Closed: ${a[7]}
                                            </p>
                                        </div>
                                      </a>
                                `);
                            } else {
                                property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                            }
                        }
                    } else {

                        property_box.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                    }
                })
            });

            //RESETING THE FILTERS
            body.on("click", "button[id='reset_form']", function () {
                window.location.reload();
            });

            //SEARCHING / FILTERING THROUGH INPUT
            body.find("[search_input]").on("keyup", function () {
                let value_ = $(this).val();
                if (value_.length <= 0) {
                    location.reload();
                } else {
                    let nav = body.find("[investmenttype_tabs]").find(".nav-link.active");
                    let curr_nav = nav.text().trim();
                    let id_attr = nav.attr("nav_data");
                    let panel = body.find(".tab-content").find(`#${id_attr.toLowerCase()}`);
                    let property_box = panel.find("[data-open]");
                    let data = {
                        "data": value_,
                        "curr_nav": curr_nav
                    }
                    property_box.empty();
                    if (!property_box.hasClass("grid-box")) {
                        property_box.addClass("grid-box");
                    }
                    AjaxSubmit("/filter-properties-search", "POST", data, true).then(function (result) {
                        let data = result["data"]
                        if (data !== "empty") {
                            for (let i = 0; i < data.length; i++) {
                                let a = data[i];
                                let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                                //appending properties
                                if (a[8] === "Yes") {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="grid-card-alert p-2 display-7" style="pointer-events: none;cursor:default">
                                            <p class="m-0 p-0 col-7 m-auto">
                                                Closed: ${a[7]}
                                            </p>
                                        </div>
                                      </a>
                                `);
                                } else {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                                }
                            }
                        } else {

                            property_box.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                        }
                    })
                }
            });
        };

        let sortBy = () => {
            let sortbyfilter_box = body.find("[sortbyfilter_box]");
            let sortbyfilter_current = sortbyfilter_box.find("[sortbyfilter_current]");
            let sortbyfilter_links = sortbyfilter_box.find("[sortbyfilter_links]");

            sortbyfilter_links.children("a").each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    let $parentBTN = $(this);
                    let nav = body.find("[investmenttype_tabs]").find(".nav-link.active");
                    let curr_nav = nav.text().trim();
                    let id_attr = nav.attr("nav_data");
                    let panel = body.find(".tab-content").find(`#${id_attr.toLowerCase()}`);
                    let property_box = panel.find("[data-open]");
                    let data = {
                        "data": $(this).text().trim(),
                        "curr_nav": curr_nav
                    }
                    property_box.empty();
                    if (!property_box.hasClass("grid-box")) {
                        property_box.addClass("grid-box");
                    }
                    body.append(page_loader());
                    AjaxSubmit("/filter-properties-sortby", "POST", data, true).then(function (result) {
                        let data = result["data"];
                        remove_loader();
                        sortbyfilter_current.text($parentBTN.text());
                        if (data !== "empty") {
                            for (let i = 0; i < data.length; i++) {
                                let a = data[i];
                                let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                                //appending properties
                                if (a[8] === "Yes") {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="grid-card-alert p-2 display-7" style="pointer-events: none;cursor:default">
                                            <p class="m-0 p-0 col-7 m-auto">
                                                Closed: ${a[7]}
                                            </p>
                                        </div>
                                      </a>
                                `);
                                } else {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                                }
                            }
                        } else {

                            property_box.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                        }
                    })


                });
            });

        };

        let sortbyView = () => {

            let sortbyview_box = body.find("[sortbyview_box]");
            let sortbyview_current = sortbyview_box.find("[sortbyview_current]");
            let sortbyview_links = sortbyview_box.find("[sortbyview_links]");

            sortbyview_links.children("a").each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    let $parentBTN = $(this);
                    let nav = body.find("[investmenttype_tabs]").find(".nav-link.active");
                    let curr_nav = nav.text().trim();
                    let id_attr = nav.attr("nav_data");
                    let panel = body.find(".tab-content").find(`#${id_attr.toLowerCase()}`);
                    let property_box = panel.find("[data-open]");
                    let data = {
                        "data": $(this).text().trim(),
                        "curr_nav": curr_nav
                    }
                    property_box.empty();
                    if (!property_box.hasClass("grid-box")) {
                        property_box.addClass("grid-box");
                    }
                    body.append(page_loader());
                    AjaxSubmit("/filter-properties-sortbyview", "POST", data, true).then(function (result) {
                        let data = result["data"];
                        remove_loader();
                        sortbyview_current.text($parentBTN.text());
                        if (data !== "empty") {
                            for (let i = 0; i < data.length; i++) {
                                let a = data[i];
                                let fav = (a[35] === "isFavourite") ? "active ri-heart-fill" : "ri-heart-line";
                                //appending properties
                                if (a[8] === "Yes") {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="grid-card-alert p-2 display-7" style="pointer-events: none;cursor:default">
                                            <p class="m-0 p-0 col-7 m-auto">
                                                Closed: ${a[7]}
                                            </p>
                                        </div>
                                      </a>
                                `);
                                } else {
                                    property_box.append(`
                                      <a href="#" class="grid-card" property_id="${a[0]}">
                                        <div class="grid--card-top">
        
                                            <div
                                                    class="grid--highlight small d-flex justify-content-between align-items-center">
        
                                                <div class="l-txt mr-2">
                                                    <span class="mr-2">${a[19]}</span>
                                                    <span> ${a[18]}</span>
                                                </div>
        
                                                <span class="r-txt text-danger">${a[36]}</span>
                                            </div>
        
                                            <img src="/static/private_/houses/${a[0]}/1.png" alt="img">
        
                                        </div>
                                        <div class="grid--card-footer">
        
                                            <div class="card--head d-flex align-items-center">
                                                <div class="name-section">
                                                    <h4 class="location small text-brown">${a[3]}, ${a[2]}</h4>
                                                    <h3 class="name display-5">${a[1]}</h3>
                                                </div>
                                                <i class=" ${fav} display-4 card-icon" fav_btn></i>
                                            </div>
        
                                            <div class="card--bottom">
        
                                                <div class="card--caption">
                                                    <span class="d-block display-6">${a[4]}</span>
                                                    <div class="card-badge badge badge-primary">${a[29]}</div>
                                                </div>
        
                                                <ul class="card--des">
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> IRR</span>
                                                        <span class="list-percent">${a[9]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Equity Multiple</span>
                                                        <span class="list-percent">${a[12]}x</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Average Cash Yield</span>
                                                        <span class="list-percent">${a[10]}%</span>
                                                    </li>
                                                    <li
                                                            class="des-item d-flex align-items-center justify-content-between">
                                                        <span class="list-name"> Investment period</span>
                                                        <span class="list-percent">${a[14]}</span>
                                                    </li>
        
                                                </ul>
                                            </div>
                                        </div>
                                      </a>
                                `);
                                }
                            }
                        } else {

                            property_box.append(`
                                    <div class="text-center w-100">No Property Found</div>
                                `).removeClass("grid-box");
                        }
                    })


                });
            });

        };

        let AccessProperty = () => {
            body.on("click", '[property_id]', function (e) {
                e.preventDefault();
                if (!$(e.target).is("[fav_btn]")) {
                    let data_id = $(this).attr("property_id")
                    let direction = location.origin + "/property/" + data_id;
                    location.assign(direction);

                }
            })
        };

        CurrNavMediaQuery();
        InvestmentTypeNavs();
        favourites();
        filterBox();
        sortBy();
        sortbyView();
        AccessProperty();

    };

    // Property page Script
    let property = () => {
        let investbtn = $("[investbtn]");
        let content = body.find("[app-data='property']");

        $("head").prepend("<link rel='stylesheet' href='/static/private_/css/app.css'>")

        // New investment card
        let New_investment = () => {
            return `<div class="new_investment" new_investment=""><div class="col-span-12 lg:col-span-8 xxl:col-span-9 flex lg:block flex-col-reverse w-75"><form NewInvestmentForm><div class="intro-y box lg:mt-5" style="min-height: 60vh;"><div class="flex items-center p-8 border-b border-gray-200"><h2 class="font-medium text-base mr-auto"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-8 h-8 mr-2 text-theme-1"><rect width="448" height="256" x="32" y="80" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" rx="16" ry="16" transform="rotate(180 256 208)"></rect><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 384h384M96 432h320"></path><circle cx="256" cy="208" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M480 160a80 80 0 01-80-80M32 160a80 80 0 0080-80m368 176a80 80 0 00-80 80M32 256a80 80 0 0180 80"></path></svg> New Investment</h2></div><div class="p-8" ><label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">Select investment Plan</label><div class="relative" ><select name="select_investmentPlan" required="" class="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state"><option value>Select investment Plan</option><option value="0">Quarterly plan (3 months)</option><option value="1">biannual plan (6 months)</option><option value="2">yearly plan (1 year)</option><option value="3">+1year Plan (+1 year)</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg></div></div><label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" for="grid-currency">Select Currency</label><div class="relative" btm_adv><select name="select_currency" required class="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-currency"><option value>Select Currency</option><option value="bitcoin">Bitcoin</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg></div></div><div class="flex justify-center sm:justify-start mt-5"><button type="submit" class="button mr-3 flex items-center justify-center bg-theme-1 text-white">Submit <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M380.93 57.37A32 32 0 00358.3 48H94.22A46.21 46.21 0 0048 94.22v323.56A46.21 46.21 0 0094.22 464h323.56A46.36 46.36 0 00464 417.78V153.7a32 32 0 00-9.37-22.63zM256 416a64 64 0 1164-64 63.92 63.92 0 01-64 64zm48-224H112a16 16 0 01-16-16v-64a16 16 0 0116-16h192a16 16 0 0116 16v64a16 16 0 01-16 16z"></path></svg></button><button type="button" name="cancel_addInvestment" class="button mr-3 flex items-center justify-center bg-theme-31 text-theme-6">Cancel <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144m224 0L144 368"></path></svg></button></div></div></div></form></div></div>`
        };

        // The add investment amount card
        let add_investment_amount = (amount) => {
            return `<div add_investment_amount class="flex flex-wrap -mx-3 my-6"><div class="w-full px-3"><label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-amount">Enter Amount</label><input name="amount" required="" class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" id="grid-amount" type="number" min="${amount.replace(",", "")}" value="${amount.replace(",", "")}"><p class="text-gray-600 text-xs italic">Amount mustn't be less then $${amount}</p></div></div>`
        };

        let add_investment_desc = (percent, min, max) => {
            return `<div add_investment_desc class="intro-y"><div class="text-gray-800 text-center mt-5"><strong>${percent} percent REIT</strong><span class="mx-1 text-theme-1">•</span>Minimum Investment - <strong> $${min}</strong> <span class="mx-1 text-theme-1">•</span>Maximum Investment - <strong> $${max}</strong></div></div>`
        };


        //creating new investment
        investbtn.on("click", function (e) {
            e.preventDefault();
            content.append(New_investment());
        });

        content.on("change", "[name='select_investmentPlan']", function () {
            let category_id = content.find("[name='select_investmentPlan'] :selected").text().trim();

            let data = {"category": category_id}

            content.find("[add_investment_amount]").remove();
            content.find("[add_investment_desc]").remove();

            AjaxSubmit("/loadplaninfo", "POST", data, true).then(function (data) {
                let result = data["data"]
                content.find("[NewInvestmentForm]").find("[btm_adv]").after(add_investment_amount(result["amount"]))
                content.find("[NewInvestmentForm]").find("[btm_adv]").after(add_investment_desc(result["percent"], result["amount"], result["max"]))
            });

        });

        content.on("click", "[name='cancel_addInvestment']", function () {

            if (content.find("[all_investment]").length === 1) {
                content.find("[no_investement]").remove();
                content.find("[new_investment]").remove();
                content.find("[all_investment]").css("display", "grid");
            } else {
                content.find("[no_investement]").css("display", "flex");
                content.find("[new_investment]").remove();
            }


        });

        content.on("submit", "[NewInvestmentForm]", function (e) {
            e.preventDefault();
            let form = new FormData(this);
            let property_id = content.attr("property_id");
            let plan = content.find('[name="select_investmentPlan"] :selected').text()
            form.append("property_id", property_id)
            form.append("plan", plan);
            content.find("[type='submit']").html("Wait..").prop("disabled", true);
            AjaxSubmit("/CreateInvestment", "POST", form, false).then(function (data) {
                if (data["data"] === "created") {
                    content.find("[type='submit']").html("submit <svg viewBox=\"0 0 512 512\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" class=\"StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M380.93 57.37A32 32 0 00358.3 48H94.22A46.21 46.21 0 0048 94.22v323.56A46.21 46.21 0 0094.22 464h323.56A46.36 46.36 0 00464 417.78V153.7a32 32 0 00-9.37-22.63zM256 416a64 64 0 1164-64 63.92 63.92 0 01-64 64zm48-224H112a16 16 0 01-16-16v-64a16 16 0 0116-16h192a16 16 0 0116 16v64a16 16 0 01-16 16z\"></path></svg>").prop("disabled", false);
                    CustomAlert("success", "Investment has been created successfully")
                    setTimeout(function () {
                        window.location.href = "/transactions"
                    }, 1000);
                }
            });
        });

    }

    // Transaction page script
    let transactions = () => {
        $("head").append("<link rel='stylesheet' href='/static/private_/css/app.css'>")
        $("nav.navbar").find("hr").css("top", "55%");

        let All_investment = () => {
            return `<div class="grid grid-cols-12 gap-6  m-auto" style="width: 90%; padding-bottom: 20px" All_investment></div>`
        };

        let No_investement = () => {
            return '<div class="flex flex-col items-center" style="min-height: 60vh;" No_investement><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-16 h-16 text-theme-1 mx-auto mt-5"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg><p class="text-gray-600 mx-auto mt-5">No investment yet! Select a property and click invest now to create your first investment.</p></div>'
        };

        let waiting = (id, category, plan, amount, roi) => {
            return `<div invest_id="${id}" class="intro-y box col-span-12 py-8 md:col-span-4" style="min-height: 5%;margin: auto;width: 100%"><div class="rounded-md flex items-center px-3 py-3 mb-2 bg-theme-14 text-theme-10"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-6 h-6 mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>You have not paid for this investment yet!</div><div class="text-center font-bold text-gray-600 mt-10" waiting_category>${category}</div><div class="text-xl font-medium text-center" waiting_plan>${plan}</div><div class="flex justify-center"><div class="relative text-5xl font-semibold mt-2 mx-auto" waiting_amount>${amount} <span class="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span></div></div><div class="text-gray-700 text-center mt-2">Return on Investment <span class="font-bold">$${roi}</span></div><div class="p-3 flex justify-center"><a data-toggle="modal" href="#" data_target="payment-box" title="Pay" class="button  mr-2 mb-2 flex items-center justify-center bg-theme-1 text-white">Make Payment <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2"><rect width="416" height="288" x="48" y="144" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" rx="48" ry="48"></rect><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M411.36 144v-30A50 50 0 00352 64.9L88.64 109.85A50 50 0 0048 159v49"></path><path d="M368 320a32 32 0 1132-32 32 32 0 01-32 32z"></path></svg></a></div></div>`
        }

        let pending = (id, category, plan, amount, roi) => {
            return `<div invest_id="${id}" class="intro-y box col-span-12 py-8 md:col-span-4" style="min-height: 5%;margin: auto;width: 100%"><div class="rounded-md flex items-center px-3 py-3 mb-2 bg-theme-1 text-white"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-6 h-6 mr-2"><circle cx="256" cy="256" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></circle><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M160 256H48m416 0H352"></path></svg>Waiting Approval</div><div class="text-center font-bold text-gray-600 mt-10">${category}</div><div class="text-xl font-medium text-center">${plan}</div><div class="flex justify-center"><div class="relative text-5xl font-semibold mt-2 mx-auto">${amount} <span class="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span></div></div><div class="text-gray-700 text-center mt-3">Return on Investment <span class="font-bold">$${roi}</span></div></div>`
        }

        let decline = (id, category, plan, amount, roi) => {
            return `<div invest_id="${id}" class="intro-y box col-span-12 py-8 md:col-span-4" style="min-height: 5%;margin: auto;width: 100%"><div class="rounded-md flex items-center px-3 py-3 mb-2 bg-theme-6 text-white"><svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-6 h-6 mr-2"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192m0 128l128-128"></path></svg>Investment Declined</div><div class="text-center font-bold text-gray-600 mt-10">${category}</div><div class="text-xl font-medium text-center">${plan}</div><div class="flex justify-center"><div class="relative text-5xl font-semibold mt-2 mx-auto">${amount} <span class="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span></div></div><div class="text-gray-700 text-center mt-2">Return on Investment <span class="font-bold">$${roi}</span></div></div>`
        }

        let approved = (id, category, plan, amount, roi, expiration) => {
            return `<div invest_id="${id}" class="intro-y box col-span-12 py-8 md:col-span-4" style="min-height: 5%;margin: auto;width: 100%"><div class="rounded-md flex items-center px-3 py-3 mb-2 bg-theme-9 text-white"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-6 h-6 mr-2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Investment in progress</div><div class="text-center font-bold text-gray-600 mt-10" cate="${category}">${category}</div><div class="text-xl font-medium text-center">${plan}</div><div class="flex justify-center"><div class="relative text-5xl font-semibold mt-2 mx-auto">${amount}<span class="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span></div></div><div class="text-gray-700 text-center mt-2">Return on Investment <span class="font-bold">$${roi}</span></div><div class="text-gray-800 px-10 text-center mx-auto mt-2"><b>Investment Expiration</b> <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO text-theme-1 h-4 mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg> <span>${expiration}</span></div></div>`
        }

        let closed = (id, category, plan, amount, roi, expiration) => {
            return `<div invest_id="${id}" class="intro-y box col-span-12 py-8 md:col-span-4" style="min-height: 5%;margin: auto;width: 100%"><div class="rounded-md flex items-center px-3 py-3 mb-2 bg-theme-13 text-white"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-6 h-6 mr-2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Investment has been completed.</div><div class="text-center font-bold text-gray-600 mt-10">${category}</div><div class="text-xl font-medium text-center">${plan}</div><div class="flex justify-center"><div class="relative text-5xl font-semibold mt-2 mx-auto">${amount}<span class="absolute text-2xl top-0 right-0 text-gray-500 -mr-4 mt-1">$</span></div></div><div class="text-gray-700 text-center mt-2">Return on Investment <span class="font-bold">$${roi}</span></div><div class="text-gray-800 px-10 text-center mx-auto mt-2"><b>Investment Expiration</b> <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO text-theme-1 h-4 mr-1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg> <span>${expiration}</span></div></div>`
        }

        let Payment_box = (id, amount, plan, currency) => {
            return `<div invest_id="${id}" class="mymodal overflow-y-auto show" id="payment-box" payment_box style="margin-top: 0px; margin-left: 0px; padding-left: 0px; z-index: 51;"><div class="modal__content"><div class="flex pl-3 items-center py-2 sm:py-3 border-b border-gray-200"><h2 class="font-medium text-base mr-auto">Investment Payment</h2></div><div class="p-3 grid grid-cols-12 gap-4 row-gap-3" group><div class="col-span-12 sm:col-span-12"><p>Make a transfer of the amount invested in bitcoin to the wallet address below. After making the payment, enter the transaction's wallet address and click on the continue button</p></div><div class="col-span-12 sm:col-span-12"><b>Investment Made</b><h6 payment_amount> ${"$" + amount.replace("$", "")}</h6></div><div class="col-span-12 sm:col-span-12"><b>Current Plan</b><h6 payment_plan>${plan}</h6></div><div class="col-span-12 sm:col-span-12"><b>Currency Selected</b><h6 payment_currency>${currency}</h6></div><div class="col-span-12 sm:col-span-12"></div><div class="col-span-12 sm:col-span-12"><button get_payment_address type="button" class="button w-full bg-theme-1 text-white">Get Payment Wallet Address</button></div></div></div></div>`
        };

        let show_payment_address = () => {
            return `
                    <div class="col-span-12 sm:col-span-12"><b>sample Wallet Address</b><div class="flex" id="parent-copy"><input class="rounded-l-lg p-2 w-full border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-gray-200" disabled="" placeholder="click to copy" value="bc1q7ye4sk2vgrfldrkt3cw8dr9yj00pcxkggt30ua"><button type="button" copy_address class="px-8 rounded-r-lg bg-green-500  text-white font-bold  uppercase border-green-500 border-t border-b border-r">Copy</button></div></div>
                    <div class="col-span-12 sm:col-span-12"><label>Payment wallet Address</label><input type="text" name="enter_wallet_address" class="input w-full border mt-2 flex-1" required placeholder="Enter the wallet address of the sender" value=""></div>
                `
        };
        let show_payment_address_submit_body = () => {
            return `<div class="px-5 py-3 text-right border-t border-gray-200"><button type="button" data-dismiss="modal" class="button w-20 border text-gray-700 mr-1" cancel_paymentBTN>Cancel</button><button type="button" class="button w-35 bg-theme-1 text-white" submit_paymentBTN>Continue <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M268 112l144 144-144 144m124-144H100"></path></svg></button></div>`
        };


        let content = body.find("[app-data='transactions']");

        let onLoadPage = () => {
            AjaxSubmit("/invests", "GET", "empty", false).then(function (data) {
                content.find(".lds-ring").remove();
                let result = data["data"];
                if (result === "no_investment") {
                    content.append(No_investement());
                } else {
                    content.append(All_investment())
                    for (let i = 0; i < result.length; i++) {
                        let res_ = result[i];
                        let status = res_["status"];

                        if (status === "waiting") {
                            content.find("[All_investment]").append(waiting(res_["id"], res_["property_id"], res_["plan"], res_["amount"], res_["roi"]));

                        } else if (status === "pending") {
                            content.find("[All_investment]").append(pending(res_["id"], res_["property_id"], res_["plan"], res_["amount"], res_["roi"]));

                        } else if (status === "approved") {

                            content.find("[All_investment]").append(approved(res_["id"], res_["property_id"], res_["plan"], res_["amount"], res_["roi"], res_["expiration"]));
                        } else if (status === "decline") {
                            content.find("[All_investment]").append(decline(res_["id"], res_["property_id"], res_["plan"], res_["amount"], res_["roi"]));
                        } else if (status === "closed") {
                            content.find("[All_investment]").append(closed(res_["id"], res_["property_id"], res_["plan"], res_["amount"], res_["roi"], res_["expiration"]));

                        }
                    }
                }
            });
        };

        content.on("click", "[data_target='payment-box']", function (e) {
            e.preventDefault();
            let myparent = $(this).parents("[invest_id]")
            let id = myparent.attr("invest_id");
            let amount = myparent.find("[waiting_amount]").text()
            let plan = myparent.find("[waiting_plan]").text();
            let currency = "Bitcoin";

            content.append(Payment_box(id, amount, plan, currency));
        });

        let payment_box_ = () => {

            body.on("click", "[get_payment_address]", function (e) {
                e.preventDefault();
                let parent_ = $(this).parents("[payment_box]");
                let group = parent_.find("[group]");
                group.children(":nth-child(5)").append(loader2());
                parent_.css("overflow", "auto");
                setTimeout(function () {
                    group.children().last().remove()
                    group.find(".lds-ring").remove()
                    group.append(show_payment_address());
                    parent_.find(".modal__content").append(show_payment_address_submit_body());
                }, 2000);
            });


            // REMOVING THE PAYMENT BOX FROM THE BODY
            body.on("click", function (e) {
                if ($(e.target).is("#payment-box")) {
                    let parent_ = body.find("[payment_box]");
                    parent_.remove();
                }
            });

            //COPYING THE WALLET ADDRESS
            body.on("click", "[copy_address]", function (e) {
                e.preventDefault();
                let $this = $(this);
                navigator.clipboard.writeText($(this).siblings("input").val()).then(function () {
                    CustomAlert("success", `${$this.siblings("input").val()} to clipboard!`)
                });
            });

            body.on('click', "[cancel_paymentBTN]", function (e) {
                e.preventDefault();
                let parent_ = body.find("[payment_box]");
                parent_.remove();
            });

            body.on("click", "[submit_paymentBTN]", function (e) {
                e.preventDefault();
                let payment_address = body.find("[name='enter_wallet_address']").val().trim();
                let parent_ = $(this).parents("[payment_box]");
                let group = parent_.find("[group]");
                let id = $(this).parents("[invest_id]").attr("invest_id");
                let data = {
                    "id": id,
                    "payment_address": payment_address
                };

                if (payment_address === '') {
                    CustomAlert("error", "Please input your payment address!");
                    return false;
                } else {
                    group.children(":nth-child(1)").prepend(page_loader());
                    body.find("[submit_paymentBTN]").html("Wait..").prop("disabled", true);
                    AjaxSubmit("/verify-payment", "POST", data, true).then(function (data) {
                        group.find(".lds-ring").remove()
                        let result = data["data"];
                        if (result === "success") {
                            body.find("[submit_paymentBTN]").html("Continue <svg viewBox=\"0 0 512 512\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" class=\"StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M268 112l144 144-144 144m124-144H100\"></path></svg>").prop("disabled", false);
                            window.location.href = "/transactions";
                        } else {
                            CustomAlert("error", "Incorrect wallet address! please check your wallet address!");
                            body.find("[submit_paymentBTN]").html("Continue <svg viewBox=\"0 0 512 512\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" class=\"StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 ml-2\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"48\" d=\"M268 112l144 144-144 144m124-144H100\"></path></svg>").prop("disabled", false);
                        }
                    });
                }


            });


        }


        payment_box_();

        setTimeout(function () {
            onLoadPage();
        }, 1000);

    }

    // Profile page script
    let profile = () => {
        $("head").append("<link rel='stylesheet' href='/static/private_/css/app.css'>")
        $("nav.navbar").find("hr").css("top", "55%");

        let profile_block = body.find("[profile_block]");
        let Profile_NavLinks = profile_block.find("[Profile_NavLinks]");
        let navlinks = Profile_NavLinks.children("a");


        navlinks.each(function () {
            $(this).on("click", function (e) {
                e.preventDefault();
                navlinks.removeClass("side-menu--active text-theme-1 font-medium ");
                $(this).addClass("side-menu--active text-theme-1 font-medium ");
                profile_block.children().last().remove();
                profile_block.append(loader2);

                switch ($(this).attr("href")) {
                    case "/profile":
                        profile_block.find(".lds-ring").remove();
                        window.location.href = "/profile";

                        break;
                    case "/change-image":
                        setTimeout(function () {
                            AjaxSubmit("/profile-info", "POST", "empty", false).then(function (data) {
                                profile_block.find(".lds-ring").remove();
                                profile_block.append(Profile_card().change_image(data["pf"]));

                            });
                        }, 1000)

                        break;
                    case "/update":
                        setTimeout(function () {
                            AjaxSubmit("/profile-info", "POST", "empty", false).then(function (data) {
                                profile_block.find(".lds-ring").remove();
                                profile_block.append(Profile_card().update(data["firstname"], data["email"], data["gender"], data["ssn"], data["lastname"], data["phone"], data["contact_address"]))
                                profile_block.find("select").find(`[value=${data["gender"]}]`).attr("selected", "selected");


                            });
                        }, 1000)

                        break;
                    case "/next-of-kin":
                        setTimeout(function () {
                            AjaxSubmit("/profile-info", "POST", "empty", false).then(function (data) {
                                profile_block.find(".lds-ring").remove();
                                profile_block.append(Profile_card().next_of_kin(data["kin_name"], data["kin_email"], data["kin_relation"], data["kin_phone"], data["kin_pf"]));
                                profile_block.find("select").find(`[value=${data["kin_relation"]}]`).attr("selected", "selected");
                            });
                        }, 1000);
                        break;
                    case "/change-password":
                        setTimeout(function () {
                            profile_block.append(Profile_card().change_password())
                            profile_block.find(".lds-ring").remove();
                        }, 1000)
                        break;
                    case "/change-email":
                        setTimeout(function () {
                            profile_block.append(Profile_card().change_email())
                            profile_block.find(".lds-ring").remove();
                        }, 1000)
                        break;
                    default:
                        break;
                }


            })
        });

        let update_account_setting = () => {
            body.on("submit", "[updateForm]", function (e) {
                e.preventDefault();
                let btn_ = body.find("[updateForm]").find("[type='submit']");
                btn_.html("Please wait...");
                let form = new FormData(this);
                AjaxSubmit("/update-bio", "POST", form, false).then(function (data) {
                    btn_.html(`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Changes`);
                    let result = data["data"];
                    if (result === "success") {
                        CustomAlert("success", "The changes has been saved successfully!")
                    }
                });
            });
        };

        let update_next_of_kin = () => {
            body.on("submit", "[updatenextkin]", function (e) {
                e.preventDefault();
                let btn_ = body.find("[updatenextkin]").find("[type='submit']");
                btn_.html("Please wait...");
                let form = new FormData(this);
                AjaxSubmit("/update-kin", "POST", form, false).then(function (data) {
                    btn_.html(`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="StyledIconBase-ea9ulj-0 hPhvO w-4 h-4 mr-2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Changes`);
                    let result = data["data"];
                    if (result === "success") {
                        CustomAlert("success", "The changes has been saved successfully!")
                    }
                });

            });


            body.on("change", "[name='change_kin_pf_inp']", function () {
                if (this.files) $.each(this.files, readAndPreview);

                function readAndPreview(i, file) {
                    if (!/\.(jpe?g|png)$/i.test(file.name)) {
                        return CustomAlert("error", file.name + " " + "is not an image");
                    }
                    let reader = new FileReader();

                    $(reader).on("load", function () {
                        let image_data = this.result.replace("data:" + file.type + ";base64,", '');
                        let data = {
                            "pf": image_data
                        };
                        body.find("[change_kin_pf_btn]").prop("disabled", true).html("please wait..");
                        AjaxSubmit("/kin-photo", "POST", data, true).then(function (data) {
                            if (data["data"][0] === "success") {
                                body.find("[change_kin_pf_btn]").prop("disabled", false).html("Change Picture");
                                body.find("[kin_display_photo]").attr("src", reader.result);
                                CustomAlert("success", "your display photo has been changed successfully")
                            }
                        });
                    });
                    reader.readAsDataURL(file);
                }

            });


        };


        update_account_setting();
        update_next_of_kin();


    };

    // Portfolio page script
    let portfolio = () => {
        let AddRespositories = () => {
            $("head").append("<link rel='stylesheet' href='/static/admin/vendors/themefy_icon/themify-icons.css'>");
            $("head").append("<link rel='stylesheet' href='/static/admin/vendors/datatable/css/jquery.dataTables.min.css'>");
            $("head").append("<link rel='stylesheet' href='/static/admin/vendors/datatable/css/responsive.dataTables.min.css'>");
            $("head").append("<link rel='stylesheet' href='/static/admin/vendors/datatable/css/buttons.dataTables.min.css'>");
            $("head").append("<link rel='stylesheet' href='/static/admin/css/style.css'>");

            $("body").append("<script src='/static/admin/js/metisMenu.js'></script>")
            $("body").append("<script src='/static/admin/vendors/datatable/js/jquery.dataTables.min.js'></script>")
            $("body").append("<script src='/static/admin/vendors/datatable/js/dataTables.responsive.min.js'></script>")
            $("body").append("<script src='/static/admin/vendors/datatable/js/dataTables.buttons.min.js'></script>")
            $("body").append("<script src='/static/admin/js/custom.js'></script>")

            $("body").css("font-family", "ABeeZee");
        };
        AddRespositories();
    };

    ProfilePhoto();
    ChangePassword();
    ChangeEmail();

    switch (app_name.attr("app-data")) {
        case "data-market":
            marketplace();
            break;
        case "property":
            property();
            break;
        case "transactions":
            transactions();
            break;
        case "profile":
            profile();
            break;
        case "portfolio":
            portfolio();
            break;
        default:
            console.log("Check the general.js for debugging..")
    }
});