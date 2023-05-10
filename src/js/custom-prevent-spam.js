import $ from 'jquery';

const checkElement = async selector => {
    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector); 
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

const trackChange = function(element) {
  const observer = new MutationObserver(function(mutations, observer) {
    if(mutations[0].attributeName == "value") {
        $(element).trigger("change");
    }
  });
  observer.observe(element, {
    attributes: true
  });
}

$(".ewp_widget_btnid").on("click", function() {
    checkElement('.activePopup').then((selector) => {
        var ewForm = $(".activePopup").find("form");
        ewForm.append("<input type='input' name='email-addi' class='email-addi' value='' />");

        var spamCheck = ewForm.find(".email-addi");
        var ewSubmit = ewForm.find(".ewp_submit");

        trackChange( spamCheck[0] );
        
        spamCheck.change(function(){
            // console.log("changed");
            ewSubmit.prop("disabled", true);
            ewForm.prop("disabled", true);
        });
    });
});