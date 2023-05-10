import jQuery from "jquery";
// import Cookies from "js-cookie"

import {
    lazyImageLoad
} from './lazy-image';
import truncStr from './str.trunc';

const lazySections = {
    hidden_sections: require('../chunks/_hidden-section.html'),
    // call_to_action: require('../chunks/comment-call-to-action-section.html'),
    // intro: require('../chunks/intro-section.html'),
    // testimonials: require('../chunks/testimonials-section.html'),
    // bio: require('../chunks/bio-section.html'),
    // common_bg: require('../chunks/common-bg-section.html'),
    // about_foundr: require('../chunks/about-foundr-section.html'),
    // mag_list: require('../chunks/mag-list-section.html'),
    // footer: require('../chunks/footer-section.html'),
};

function lazyLoadHtml(elements) {
    elements.forEach(function(item) {
        if (item.intersectionRatio > 0) {
            // var el = item.target.querySelector("img");
            var section = item.target.getAttribute('data-section');
            const content = lazySections[section];

            item.target.innerHTML = content;
            item.target.classList.remove("lazy-html");
            lazyImageLoad();
            // image.setAttribute('src', url);
            jQuery(document).trigger('after_lazy_html_complete');
            observer.unobserve(item.target);
        };
    });
};

if ('undefined' !== typeof IntersectionObserver) {
    var options = {};
    var observer = new IntersectionObserver(lazyLoadHtml, options);
    var htmls = document.querySelectorAll('.lazy-html');
    htmls.forEach(function(html) {
        observer.observe(html);
    });

} else {
    jQuery(function($) {
        $('.lazy-html').each(function() {
            // alert($(this).attr('data-section'));
            const section = $(this).attr('data-section');
            const content = lazySections[section];
            // alert(content);
            $(this).html(content).removeClass("lazy-html");
            lazyImageLoad();
            FB.XFBML.parse();
        });
    })
}