// import VideoId from './VideoId';
// import VideoDeadlines from './VideoDeadlines';
import jQuery from 'jquery';

const everyFifteenMinute = () => {
    // var coeff = 1000 * 60 * 5;
    // var date = new Date();  //or use any other date
    // var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
    return new Date(Math.ceil(new Date().getTime()/900000)*900000);;
}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    //var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        //'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    //var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        var t = getTimeRemaining(endtime);

        //daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('00' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('00' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('00' + t.seconds).slice(-2);



        if (t.total <= 0) {
            //daysSpan.innerHTML = 0;
            // hoursSpan.innerHTML = 0;
            // minutesSpan.innerHTML = 0;
            // secondsSpan.innerHTML = 0;
            // clearInterval(timeinterval);
            let deadline = everyFifteenMinute();
            window.localStorage.setItem('60ds-reg-page-deadline', deadline);
            endtime = deadline;
            
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}
let deadline = window.localStorage.getItem('60ds-reg-page-deadline');
console.log(deadline);

if ( '' == deadline || null === deadline ) {
    
    deadline = everyFifteenMinute();
    window.localStorage.setItem('60ds-reg-page-deadline', deadline);
} else if(( Date.parse(deadline)-Date.parse(new Date()) )<0) {
    // console.log(null === deadline);
    // console.log(Date.parse(deadline)-Date.parse(new Date()));
    deadline = everyFifteenMinute();
    window.localStorage.setItem('60ds-reg-page-deadline', deadline);
}

// initializeClock('clockdiv', deadline);
// initializeClock('clockdiv1', deadline);
// initializeClock('clockdiv2', deadline);
// initializeClock('clockdiv3', deadline);
// initializeClock('clockdiv4', deadline);
// initializeClock('clockdiv-mobile', deadline);

jQuery(function($){
    // deadline = new Date(1626793200000);
    initializeClock('clockdiv', deadline);
    initializeClock('clockdiv1', deadline);
    initializeClock('clockdiv2', deadline);
    initializeClock('clockdiv3', deadline);
    initializeClock('clockdiv4', deadline);

    // $(document).on( 'after_lazy_html_complete', function () {
    //     var head = document.body;
    //     var script = document.createElement('script');
    //     script.type = 'text/javascript';
    //     script.src = 'https://ewpcdn.easywebinar.com/widget/js/ewp_widget.js?v=1.23.27';

    //     // Then bind the event to the callback function.
    //     // There are several events for cross browser compatibility.
    //     // script.onreadystatechange = callback;
    //     // script.onload = callback;

    //     // Fire the loading
    //     head.appendChild(script);
    // });
});