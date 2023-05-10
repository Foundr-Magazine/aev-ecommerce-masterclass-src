import jQuery from "jquery";
function lazyLoad(elements,observer) {
    elements.forEach(function (item) {
        if (item.intersectionRatio > 0) {
            var image = item.target.querySelector("img");
            var url = image.getAttribute('data-src');
            image.setAttribute('src', url);
            observer.unobserve(item.target);
        };
    });
};

let lazyImageLoad = () => {

    if ('undefined' !== typeof IntersectionObserver) {
        var options = {};
        var observer = new IntersectionObserver(lazyLoad, options);
        var pictures = document.querySelectorAll('.lazy')
        // console.log(pictures);
        
        pictures.forEach(function (pic) {
            observer.observe(pic);
        });
    
        var observer1 = new IntersectionObserver(function (elements) {
            elements.forEach(function (item) {
                if (item.intersectionRatio > 0) {
                    var url = item.target.getAttribute('data-src');
                    item.target.style.backgroundImage = "url('" + url + "')";
                    observer1.unobserve(item.target);
                };
            });
        }, options);
    
        // Watch for all pictures with a "lazy" class
        var pictures = document.querySelectorAll('.lazy-bg');
        pictures.forEach(function (pic) {
            observer1.observe(pic);
        });
    } else {
        jQuery(function ($) {
            $('.lazy').each(function () {
                var url = $(this).find('img').attr('data-src');
                $(this).find('img').attr('src', url);
            });

            $('.lazy-bg').each(function () {
                var url = $(this).attr('data-src');
                // alert(url)
                $(this).css({backgroundImage:"url('" + url + "')"});
            });
        })
    }
}

export {lazyImageLoad};