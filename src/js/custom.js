import $ from 'jquery';
// import Swiper from 'swiper';
import {
    lazyImageLoad
} from './lazy-image';

import {
    countUp
} from './countUp';
$(function() {
    lazyImageLoad();

    function addMacClasses() {
        var userAgent = window.navigator.userAgent;
        // for mac
        if (window.navigator.userAgent.indexOf("Mac") != -1) {
            $('body').addClass('foundr-mac');
            $('a.btn').addClass('btn-mac');
            $('#clockdiv, #clockdiv-mobile').addClass('timer-mac');
        } else if (/Android/.test(userAgent)) {
            $('body').addClass('foundr-mac');
            $('a.btn').addClass('btn-mac');
            $('#clockdiv, #clockdiv-mobile').addClass('timer-mac');
        } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
            $('body').addClass('foundr-mac');
            $('a.btn').addClass('btn-mac');
            $('#clockdiv, #clockdiv-mobile').addClass('timer-mac');
        }
    }
    addMacClasses();
    countUp('.count');

    function support_format_webp() {
        var elem = document.createElement('canvas');
        
        if (!!(elem.getContext && elem.getContext('2d'))) {
            // was able or not to get WebP representation
            return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
        }
        
        // very old browser like IE 8, canvas not supported
        return false;
    }
      
    if (support_format_webp()) {
        $('body').addClass('has-webp-support');
    } else {
        $('body').addClass('no-webp-support');
    }

    $('.popup-btn').each(function(){
        $(this).on('click', function(){
            //$('#popup').magnificPopup('open');
            $('#popup').css('display', 'flex');
            $('#popup').on('click', function (e) {
                if ($(e.target).closest("#popup-frame").length === 0) {
                    $("#popup").hide();
                }
            });
        })
    });

    $('#popup .close-btn').click(function(){
        $('#popup').css('display', 'none');
        //$('html').css('overflow', 'visible');
    })
})