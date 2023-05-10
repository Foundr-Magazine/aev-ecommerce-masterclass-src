import $ from 'jquery';
var regInterval = setInterval(function () {
  if (window.jQuery && typeof window.jQuery === 'function' 
    && window.tp_getCookie && typeof window.tp_getCookie === 'function') {
    clearInterval(regInterval);
    ga_reg_init(); // where init is the entry point for your code execution
  }
}, 200);

function ga_reg_init() {
  $(function () {
    // ----------------------------------------
    // Section 0. Init functions
    // ----------------------------------------

    var Cookie =
    {
      set: function (name, value, days) {
        var domain, domainParts, date, expires, host;

        if (days) {
          date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        }
        else {
          expires = "";
        }

        host = location.host;
        if (host.split('.').length === 1) {
          document.cookie = name + "=" + value + expires + "; path=/";
        }
        else {
          // Remember the cookie on all subdomains.
          //
          // Start with trying to set cookie to the top domain.
          // (example: if user is on foo.com, try to set
          //  cookie to domain ".com")
          //
          // If the cookie will not be set, it means ".com"
          // is a top level domain and we need to
          // set the cookie to ".foo.com"
          domainParts = host.split('.');
          domainParts.shift();
          domain = '.' + domainParts.join('.');

          document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;

          // check if cookie was successfuly set to the given domain
          // (otherwise it was a Top-Level Domain)
          if (Cookie.get(name) == null || Cookie.get(name) != value) {
            // append "." to current domain
            domain = '.' + host;
            document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
          }
        }
      },

      get: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
          }

          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      },

      erase: function (name) {
        Cookie.set(name, '', -1);
      }
    };

    function getGaTrackingParameters() {
      var clientID = '';

      if (ga.getAll instanceof Function && (ga.getAll()).length > 0) {
        clientID = ga.getAll()[0].get('clientId');
      } else {
        var gaID = tp_getCookie ? tp_getCookie('_ga') : '';
        if (gaID) {
          clientID = `${gaID.split(".")[2]}.${gaID.split(".")[3]}`;
        }
      }

      window.clientID = clientID;
    }

    function setClientID () {
      var searchParams = new URLSearchParams(window.location.search);
      searchParams.set('clientID', window.clientID);
      history.replaceState(null, null, "?" + searchParams.toString());
    }

    function createDataLayerObject(event, eventCategory, eventAction, eventLabel, userID, clientID, funnelType, funnelProductName, dataAdditions) {
      const data = {
        event: event,
        eventCategory: eventCategory,
        eventAction: eventAction,
        eventLabel: eventLabel
      }

      if (userID) {
        data.userID = userID
      }

      if (clientID) {
        data.clientID = clientID
      }

      if (funnelType) {
        data.funnelType = funnelType
      }

      if (funnelProductName) {
        data.funnelProductName = funnelProductName
      }

      if (dataAdditions) {
        data[dataAdditions.key] = dataAdditions.values
      }

      return data;
    }

    function getEventCategory(scrollPercent) {
      let bodyPosition = 'body 0'

      switch (true) {
        case (scrollPercent <= 25):
          bodyPosition = 'body 0-25'
          break;
        case (scrollPercent > 25 && scrollPercent <= 50):
          bodyPosition = 'body 25-50'
          break;
        case (50 < scrollPercent && scrollPercent <= 75):
          bodyPosition = 'body 50-75'
          break;
        case (75 < scrollPercent):
          bodyPosition = 'body 75-100'
          break;
        default:
          bodyPosition = 'body 100'
          break;
      }

      return bodyPosition;
    }

    window.getEventCategory = getEventCategory
    window.createDataLayerObject = createDataLayerObject

    async function checkElement(selector) {
      while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
      }
      return document.querySelector(selector);
    }


    // ----------------------------------------
    // Section 1. Check ClientID & UserID
    // ----------------------------------------
    getGaTrackingParameters();


    // ----------------------------------------
    // Section 2. Add overall page tracking
    // ----------------------------------------
    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   // ** Remove userID & clientID until on page view, as long as we can identify the user from CRM (by email)
    //   // userID: window.userID,
    //   // clientID:  window.clientID,
    //   pageType: pageType,
    //   funnelProductName: funnelProductName,
    //   price: price
    // });


    // ----------------------------------------
    // Section 3. Set scroll percentage
    // ----------------------------------------
    window.scrollPercentRounded = 0;

    window.addEventListener("scroll", () => {
      let scrollTop = window.scrollY;
      let docHeight = document.body.offsetHeight;
      let winHeight = window.innerHeight;
      let scrollPercent = scrollTop / (docHeight - winHeight);
      window.scrollPercentRounded = Math.round(scrollPercent * 100);
    });


    // ----------------------------------------
    // Section 4. Page specific tracking
    // ----------------------------------------

    // ----------------------------------------------------------------
    // 4.1 Product Impression View: field value please referring to Metadata Table
    const dataAddtionsProdImpView = {
      key: 'ecommerce',
      values: {
        currencyCode: currency,
        impressions: [
          {
            name: productName,
            id: productId,
            childID: childProductId,
            price: price,
            brand: brand,
            category: category,
            variant: variant,
            list: list,
            position: 1 // always 1
          }
        ]
      }
    }

    const dataLayerProdImp = createDataLayerObject('GTMenhancedEcommerce', 'enhanced-ecommerce', 'product-impressions',
      funnelType, '', '', funnelType, funnelProductName, dataAddtionsProdImpView)
    window.dataLayer.push(dataLayerProdImp)


    $(".ewp_widget_btnid").on("click", function () {
      // set parameter for Keap
      setClientID();

      var isHeader = $(this).parents('.navbar')

      // ----------------------------------------------------------------
      // 4.2 CTA button click
      const ctaRegDataLayer = createDataLayerObject('GTMevent', isHeader && isHeader.length > 0 ? 'header' : getEventCategory(scrollPercentRounded),
        'CTA-button-click', `show-me-how|registration-form`)

      window.dataLayer.push(ctaRegDataLayer)

      checkElement('.activePopup').then(() => {
        // ----------------------------------------------------------------
        // 4.3 Product Impression Click
        const dataAddtionsProdImpClick = {
          key: 'ecommerce',
          values: {
            currencyCode: currency,
            click: {
              actionField: {
                list: list
              },
              products: [{
                name: productName,
                id: productId,
                childID: childProductId,
                price: price,
                brand: brand,
                category: category,
                variant: variant,
                position: 1 // always 1
              }]
            }
          }
        }

        const dataLayerProdClick = createDataLayerObject('GTMenhancedEcommerce', 'enhanced-ecommerce', 'product-click',
          funnelType, '', '', funnelType, funnelProductName, dataAddtionsProdImpClick)

        window.dataLayer.push(dataLayerProdClick)


        // ----------------------------------------------------------------
        // 4.4 registration tracking
        var ewForm = $(".activePopup").find("form");
        var ewSubmit = ewForm.find(".ewp_submit");
        var ewEmail = document.querySelector('[name="EMAIL"]');

        ewEmail.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
              ewSubmit.trigger('click');
            }
        });

        ewSubmit.on('click', () => {
          Cookie.set('cd_email', document.querySelector('[name="EMAIL"]').value.trim().toLowerCase());

          // // Move form-submission to webinar TY page
          // const dataLayerReg = createDataLayerObject('GTMevent', isHeader && isHeader.length > 0 ? 'header' : getEventCategory(scrollPercentRounded), 'form-submission',
          //   'registration', '', '', funnelType, funnelProductName)

          // // Push the dataLayer
          // window.dataLayer.push(dataLayerReg)

          var submitBtnClickDataLayer = createDataLayerObject('GTMevent', isHeader && isHeader.length > 0 ? 'header' : getEventCategory(scrollPercentRounded),
            'CTA-button-click', 'register-now|registration-form');
          window.dataLayer.push(submitBtnClickDataLayer);
        });
      });
    });

    let chatStatusChanged = false
    let chatOpened = false

    setInterval(() => {
      if (window.fcWidget && window.fcWidget.isOpen() === chatOpened) {
        chatStatusChanged = true
      } else {
        chatStatusChanged = false
      }

      if (!chatStatusChanged && window.fcWidget && window.fcWidget.isOpen()) {
        chatOpened = true
        const dataLayerChatOpen = createDataLayerObject('GTMevent', getEventCategory(scrollPercentRounded), 'live-chat', 'open')
        window.dataLayer.push(dataLayerChatOpen)
      }

      if (!chatStatusChanged && window.fcWidget && !window.fcWidget.isOpen()) {
        chatOpened = false
        const dataLayerChatClose = createDataLayerObject('GTMevent', getEventCategory(scrollPercentRounded), 'live-chat', 'close')
        window.dataLayer.push(dataLayerChatClose)
      }
    }, 1000);
  });
}