(function($) {

    function stateCheck(elem, clName) {
        $el = elem;
        $clName = clName
        if (!$el.hasClass(clName)) {
            $el.addClass(clName);
        } else {
            $el.removeClass(clName);
        }
    }

    function mainMenu() {
        var trigger = $('[data-role="menu-trigger"]');
        var menu = $('[data-role="menu"]');
        var body = $('body');

        trigger.click(function() {
            $(this).toggleClass('active');
            stateCheck(menu, 'active');
            stateCheck(body, 'open-menu');
        });
    }

    function imagePortrait() {
        var sectionImages = $('img', 'section.post');

        sectionImages.each(function() {
            var image = $(this);
            console.log(image);
            if (image.width() < image.height()) {
                console.log('portrait');
                image.addClass('portrait');
            }
        });
    }

    // document ready
    $(window).on('load', function() {
        mainMenu();
        imagePortrait();
    });

    // all initial on window resize
    $(window).on('resize', function() {});


})(jQuery);
