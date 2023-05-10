import $ from 'jquery'

let startCounting = (elements,observer) => {
    elements.forEach(function (item) {
        if (item.intersectionRatio > 0) {
            let $this = $(item.target);
            let countUpTo = item.target.getAttribute("data-to");
            let prefix = item.target.getAttribute("data-prefix");
            prefix = !(prefix) ? '' : prefix;

            let suffix = item.target.getAttribute("data-suffix");
            suffix = !(suffix) ? '' : suffix;

            let duration = item.target.getAttribute("data-duration");
            duration = !(duration) ? 2000 : duration;
            $({
                countNum: $this.text()
            }).animate({
                    countNum: countUpTo
                },

                {
                    duration: duration,
                    easing: "swing",
                    step: function () {
                        $this.text(`${prefix}${Math.floor(this.countNum)}${suffix}`);
                    },
                    complete: function () {
                        $this.text(`${prefix}${this.countNum}${suffix}`);
                        //alert('finished');
                    }
                }
            );
            // item.target.innerHTML = section;
            observer.unobserve(item.target);
        }
    });
};
let countUp = selector => {
    if ("undefined" !== typeof IntersectionObserver) {
        var options = {};
        var observer = new IntersectionObserver(startCounting, options);
        var htmls = document.querySelectorAll(selector);
        htmls.forEach(function (html) {
            observer.observe(html);
        });
    } else {
        $("selector").each(function () {
            let countUpTo = $(this).attr('data-to');
            let prefix = $(this).attr("data-prefix");
            prefix = !(prefix) ? '' : prefix;

            let suffix = $(this).attr("data-suffix");
            suffix = !(suffix) ? '' : suffix;
            $(selector).text(`${prefix}${countUpTo}${suffix}`);
        });
    }
};

export {countUp};