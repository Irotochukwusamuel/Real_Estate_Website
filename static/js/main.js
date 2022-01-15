//Investments Cards
$(function () {

    // Data Investment
    $("[data-invest-cards]").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrow: false,
        responsive: [
            {
                breakpoint: 950,
                settings: {
                    arrow: false,
                    centerMode: true,
                    centerPadding: "60px",
                    slidesToShow: 2,
                    infinite: true
                }
            },

            {
                breakpoint: 768,
                settings: {
                    arrow: false,
                    centerMode: true,
                    centerPadding: "60px",
                    slidesToShow: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: 0,
                    centerMode: false,
                    infinite: false
                }
            },
        ]
    });

    //Testimonil slider
    $("[data-testimonial]").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "60px",
        dots: true,
        arrow: false,
        responsive: [
            {
                breakpoint: 950,
                settings: {
                    arrow: false,
                    centerMode: true,
                    centerPadding: "60px",
                    slidesToShow: 2,
                    infinite: true
                }
            },

            {
                breakpoint: 768,
                settings: {
                    arrow: false,
                    centerMode: true,
                    centerPadding: "60px",
                    slidesToShow: 1,
                    infinite: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: 0,
                    centerMode: false,
                    infinite: false
                }
            },
        ]
    });


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


//    contact us form
    let contact_us_form = $("[contact_us]");

    contact_us_form.on("submit", function (e) {
        e.preventDefault();
        let form = new FormData(this);
        contact_us_form.find("[type='submit']").html("Sending..");
        AjaxSubmit("/contact-message", "POST", form, false).then(function (result) {
            let res = result["data"];
            if (res === "success") {
                contact_us_form.find("[type='submit']").html("Send Message");
                swal({
                    title: "Message Sent!",
                    text: "We will get back to you on your email",
                    icon: "success",
                }).then(function (isCofirm) {
                    if (!isCofirm) {
                        location.reload();
                    }
                });

            }
        })

    });

});