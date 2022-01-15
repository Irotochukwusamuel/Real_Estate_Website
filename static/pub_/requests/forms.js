$(document).ready(function () {

    let body = $("body");

    let app_name = body.find("[app-page]");

    let CustomAlert = (alert_type, message) => {

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

    let AjaxSubmit = (url, type, data, isJson) => {
        if (isJson === true) {
            return $.ajax({
                url: url,
                type: type,
                contentType: "application/json",
                data: JSON.stringify(form),
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

    function setCookie(name, value) {
        document.cookie = '' + name + '=' + value + '';
    }

    function readCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    let ringRotateCard = () => {
        return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>'
    }


    // ===== THIS IS THE SIGNUP SCRIPT ========
    let SignupPage = () => {
        let SignupForm = body.find("[SignupForm]");

        let CheckEmptyInputs = () => {
            if (SignupForm.find('input').val().trim() === '') {
                CustomAlert("danger", "Some required inputs are empty!");
                return false
            }
            return true
        }

        let CheckPasswordValidate = () => {
            let password = SignupForm.find("[name='password']");

            if (password.val().trim().length <= 5) {
                CustomAlert("error", "Password must be more 5 digits");
                return false
            }
            return true
        }

        let TogglePassword = () => {
            let eye = SignupForm.find(".see_pass");
            eye.on("click", function () {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active");
                    $(this).siblings("input").attr("type", "text");
                } else {
                    $(this).removeClass("active");
                    $(this).siblings("input").attr("type", "password");
                }
            });
        };

        let FormSubmission = () => {
            SignupForm.on("submit", function (e) {
                e.preventDefault();
                let data = new FormData(this);

                if (CheckEmptyInputs()) {
                    if (CheckPasswordValidate()) {
                        SignupForm.find("[type='submit']").prop("disabled", true).html(ringRotateCard);
                        AjaxSubmit('/CreateAccount', 'POST', data, false).then(function (data) {
                            if (data["data"][0] === "success") {
                                CustomAlert(data["data"][0], data["data"][1]);
                                setCookie("arz_", data["data"][2])
                                setTimeout(function () {
                                    window.location.href = "/dashboard"
                                }, 3000);
                            } else {
                                CustomAlert(data["data"][0], data["data"][1]);
                                SignupForm.find("[type='submit']").prop("disabled", false).html(" SIGN UP ");
                            }
                        });
                    }
                }

            });
        }

        let enablebtn = () => {
            let inp = SignupForm.find('input');


            inp.on("keyup", function () {
                let empty = false;
                inp.each(function () {
                    if ($(this).val().length === 0) {
                        empty = true;
                    }
                });

                if (empty) {
                    SignupForm.find("button").removeClass("active");
                    SignupForm.find("button").attr("disabled", "disabled");

                } else {
                    SignupForm.find("button").addClass("active");
                    SignupForm.find("button").attr("disabled", false);

                }
            });
        };

        TogglePassword();
        FormSubmission();
        enablebtn();


    }

    let LoginPage = () => {
        let SignInForm = body.find("[SignInForm]");

        let enablebtn = () => {
            let inp = SignInForm.find('input');


            inp.on("keyup", function () {
                let empty = false;
                inp.each(function () {
                    if ($(this).val().length === 0) {
                        empty = true;
                    }
                });

                if (empty) {
                    SignInForm.find("button").removeClass("active");
                    SignInForm.find("button").attr("disabled", "disabled");

                } else {
                    SignInForm.find("button").addClass("active");
                    SignInForm.find("button").attr("disabled", false);

                }
            });
        };

        enablebtn();

        SignInForm.on("submit", function (e) {
            e.preventDefault();

            SignInForm.find("[type='submit']").prop("disabled", true).html(ringRotateCard);
            let data = new FormData(this);
            AjaxSubmit('/Login', 'POST', data, false).then(function (data) {
                if (data["data"][0] === "success") {
                    setCookie("arz_", data["data"][1])
                    setTimeout(function () {
                        window.location.href = "/dashboard"
                    }, 3000);
                } else if (data["data"][0] === "isAdmin") {
                    setCookie("arz_", data["data"][1])
                    setTimeout(function () {
                        window.location.href = "/AppAdmin"
                    }, 3000);

                } else if (data["data"][0] === "error") {
                    CustomAlert(data["data"][0], data["data"][1]);
                    SignInForm.find("[type='submit']").prop("disabled", false).html("SIGN IN");
                }
            });


        })

    }

    let ForgotPassword = () => {
        let ForgotPasswordForm = body.find("[forgotpasswordform]");

        let enablebtn = () => {
            let inp = ForgotPasswordForm.find('input');


            inp.on("keyup", function () {
                let empty = false;
                inp.each(function () {
                    if ($(this).val().length === 0) {
                        empty = true;
                    }
                });

                if (empty) {
                    ForgotPasswordForm.find("button").removeClass("active");
                    ForgotPasswordForm.find("button").attr("disabled", "disabled");

                } else {
                    ForgotPasswordForm.find("button").addClass("active");
                    ForgotPasswordForm.find("button").attr("disabled", false);

                }
            });
        };

        enablebtn();

        ForgotPasswordForm.on("submit", function (e) {
            e.preventDefault();
            if (ForgotPasswordForm.attr("forgotpasswordform") === "submit") {
                let data = new FormData(this);
                ForgotPasswordForm.find("[type='submit']").prop("disabled", true).html(ringRotateCard);
                AjaxSubmit('/forgot-password', 'POST', data, false).then(function (data) {
                    if (data["data"][0] === "success") {
                        ForgotPasswordForm.children().first().append(`
                           <div class="box" style="margin-top: 10px">
                            <p class="name last">Code</p>
                            <div class="inp">
                                <input type="text" required name="verification" id="oth">
                                <i class="ri-lock-2-line"></i>
                            </div>
                        </div>
                        `);

                        ForgotPasswordForm.attr("forgotpasswordform", "verify");
                        CustomAlert("success", "A verification code has been sent to your email address.");
                        ForgotPasswordForm.find("[type='submit']").prop("disabled", false).html("Verify Code");
                    } else if (data["data"][0] === "error") {
                        CustomAlert("error", data["data"][1])
                        ForgotPasswordForm.find("[type='submit']").prop("disabled", false).html("verify your email");
                    }
                });
            } else if (ForgotPasswordForm.attr("forgotpasswordform") === "verify") {
                let data = new FormData(this);
                ForgotPasswordForm.find("[type='submit']").prop("disabled", true).html(ringRotateCard);
                AjaxSubmit('/verify-auth', 'POST', data, false).then(function (data) {
                    if (data["data"][0] === "success") {
                        setCookie("verify_email", ForgotPasswordForm.find("#email").val());
                        CustomAlert("success", "Verification successful");

                        ForgotPasswordForm.attr("forgotpasswordform", "change");

                        ForgotPasswordForm.find(".name.ist").html("New Password")
                        ForgotPasswordForm.find("#email").attr("type", "text");
                        ForgotPasswordForm.find("#email").attr("name", "password1");
                        ForgotPasswordForm.find("#email").val("");
                        ForgotPasswordForm.find(".ri-mail-line").removeClass("ri-mail-line").addClass("ri-lock-2-line");

                        ForgotPasswordForm.find(".name.last").html("Retype Password")
                        ForgotPasswordForm.find("#oth").attr("type", "text");
                        ForgotPasswordForm.find("#oth").attr("name", "password2");
                        ForgotPasswordForm.find("#oth").val("");

                        ForgotPasswordForm.find("[type='submit']").prop("disabled", false).html("Submit Password");
                    } else if (data["data"][0] === "error") {
                        CustomAlert("error", data["data"][1])
                        ForgotPasswordForm.find("[type='submit']").prop("disabled", false).html("Verify Code");
                    }
                });

            } else if (ForgotPasswordForm.attr("forgotpasswordform") === "change") {
                let data = new FormData(this);
                ForgotPasswordForm.find("[type='submit']").prop("disabled", true).html(ringRotateCard);
                AjaxSubmit('/change-forgot-password', 'POST', data, false).then(function (data) {
                    if (data["data"][0] === "success") {

                        CustomAlert("success", "Your password has been changed successfully");
                        setTimeout(function () {
                            window.location.href = "/login"
                        }, 2000);

                    } else if (data["data"][0] === "error") {
                        CustomAlert("error", data["data"][1])
                        ForgotPasswordForm.find("[type='submit']").prop("disabled", false).html("Submit Password");
                    }
                });
            }


        })
    };

    // THIS IS THE SCRIPT THAT RUNS THE WHOLE PAGE
    switch (app_name.attr("app-page")) {
        case "signup" :
            SignupPage();
            break
        case "signin":
            LoginPage();
            break
        case "forgotpassword":
            ForgotPassword();
            break
        default:
            console.log("please check if the function is called up well")
            break
    }
});