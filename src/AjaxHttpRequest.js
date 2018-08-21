/**
* AjaxHttpRequest.js
*
*/
var AjaxHttpRequest = function(name, durationMax = 0, async) {
    var ajaxRequest;
    var controlDurationRequest;
    var Observers = [];
    var EventRequest;
    var HttpRequest;

    function transferBefore() {
        EventRequest.init();
    }

    function transferComplete(evt) {
        clearTimeout(controlDurationRequest);
        EventRequest.success({
            responseText: ajaxRequest.responseText,
            responseXML: ajaxRequest.responseXML,
            status: ajaxRequest.status
        });
        Observers.forEach(currentValue => currentValue.notify(name, {
            completed: true,
            response: ajaxRequest.responseText
        }));
    }

    function transferFailed(evt) {
        EventRequest.error(ajaxRequest.statusText, ajaxRequest.status);
        Observers.forEach(currentValue => currentValue.notify(name, {
            completed: false,
            response: ajaxRequest.statusText
        }));
    }

    function transferProcessing(evt) {
        EventRequest.processingRequest();
    }

    function transferAbort() {
        EventRequest.abort();
    }

    function configureAjax() {
        ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onprogress = transferProcessing;
        ajaxRequest.onerror = transferFailed;
        ajaxRequest.onload = transferComplete;
        ajaxRequest.onabort = transferAbort;

        if(durationMax !== 0)
            controlDurationRequest = setTimeout(() => ajaxRequest.abort(), durationMax);

        transferBefore();

        ajaxRequest.open(HttpRequest.getMethod(), HttpRequest.getURI(), async);
        if(HttpRequest.getMethod() === 'POST')
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        configureHeader();
    }

    function sendAjax() {
        ajaxRequest.send(HttpRequest.getParams());
    }

    function configureHeader() {
        var header = HttpRequest.getHeader();
        for (key in header)
            ajaxRequest.setRequestHeader(key, header[key]);
        //add Cookies-user
        ajaxRequest.setRequestHeader('Cookie-user', HttpRequest.getCookies());
    }

    return {
        sendRequest() {
            configureAjax();
            sendAjax();
        },
        setObservers(observers) {
            Observers = observers;
            return this;
        },
        setEventRequest(eventRequest) {
            EventRequest = eventRequest;
            return this;
        },
        setHttpRequest(httpRequest) {
            HttpRequest = httpRequest;
            return this;
        }
    };
}
