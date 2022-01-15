$(document).ready(function () {
    let body = $('body'),
        page_id = $('[app-data]').attr('app-data')

    $('[data-remove]').on('click', function () {
        $(this).parents("[data-target='parent']").removeClass('active')
    })

    function MarketPlace() {

        //Tabs
        $(function tabs() {
            let mobileTab = $('[data-mobile-tabs]'),
                tabs = mobileTab.find('li.nav-tabs');

            tabs.each(function () {
                $(this).on("click", function () {
                    let txtPlaceholder = mobileTab.find('#txt_placeholder')
                    txtPlaceholder.html($(this).text().trim());
                    let nav_ = $(this).attr("data");
                    txtPlaceholder.attr("nav_data", nav_);
                })
            })

        })

        //Filter Container
        let hide_filter_btn = $('#hide_filter');

        hide_filter_btn.on('click', function () {
            let arrow = $(this).find('[data-wrap_icon]')

            if (!$('body').find('[data-filter-collection]').hasClass('collapse')) {
                arrow.attr('class', 'ri-arrow-up-line')
                $('body').find('[data-filter-collection]').slideDown()
                $('body').find('[data-filter-collection]').attr('data-collapse', false)
                $('body').find('[data-filter-collection]').addClass('collapse')
            } else {
                arrow.attr('class', 'ri-arrow-down-line')
                $('body').find('[data-filter-collection]').attr('data-collapse', true)
                $('body').find('[data-filter-collection]').slideUp()
                $('body').find('[data-filter-collection]').removeClass('collapse')
            }
        })


        function deselect_filter(count_box) {

            $("[data-selection]").click(function () {
                let _root = $(this).parents(".selection--row"),
                    selected = _root.find("input[type='radio']:checked"),
                    base_root = _root.closest(".wrapper");
                total_selected = base_root.find("input[type='radio']:checked").length;

                if (selected.val() !== "" || selected !== undefined) {
                    //check total selected filter
                    if (total_selected != 0) {
                        selected.prop("checked", false)
                        total_selected = base_root.find("input[type='radio']:checked").length;
                    } else {
                        count_box.find("[data-column-count]").addClass("d-none")
                    }

                    if (_root.find("input[type='radio']:checked").length == 0) {
                        $(this).addClass("d-none");
                    }
                    count_box.find("[data-column-count]").text(total_selected != 0 ? total_selected : 0)
                }

            })
        }


        function highlight_selected(filter_container, filter_btn) {
            let radio = filter_container.find("input[type='radio']");

            radio.on('click', function () {
                let checked = filter_container.find("input[type='radio']:checked"),
                    totalChecked = checked.length;
                count_placeholder = filter_btn.find('[data-column-count]');
                let input_root = $(this).parents('.selection--row')

                if (checked.val() !== undefined || checked.val() !== "") {

                    //Init reset button
                    input_root.find('[data-selection]').html("reset");
                    input_root.find('[data-selection]').removeClass('d-none')
                    /*=========*/

                    //Total selected
                    count_placeholder.removeClass('d-none')
                    count_placeholder.html(totalChecked);
                }

                deselect_filter(filter_btn);
            });
        }


        //Filter columns
        let filter_inputs_link = $('[data-placeholder]');

        filter_inputs_link.on('click', function () {

            //Init btn
            let btn = $(this),
                all_btn = filter_inputs_link.parents("[data-filters]").find("[data-placeholder]"),
                label_btn = $(btn).parents("[data-filter-link]");

            //Fetch the input value and placeholder
            let current_sublist = label_btn.find(".filter--selection"),
                general_sublist = filter_inputs_link.parents("[data-filters]").find(".filter--selection")
            filter_container = $("[data-filter-collection]")

            if (btn.hasClass("active")) {
                btn.removeClass("active");
                general_sublist.addClass("d-none");
                filter_container.removeClass("active")
            } else {
                all_btn.removeClass("active");
                btn.addClass("active");
                filter_container.addClass("active");
                general_sublist.addClass("d-none");
                current_sublist.removeClass("d-none");

                highlight_selected(label_btn, btn);
            }
            /*=========*/
        });

        $('[data-target="mobile_filter_btn"]').on("click", function () {
            body.find("[data-filters]").toggleClass("show")
        })

    }

    function Messages() {
        $('#example').DataTable({
            // "scrollX": true
        })
    }


    switch (page_id) {
        case 'data-market':
            MarketPlace()
            break;
        case 'message':
            Messages()
            break;
    }
})