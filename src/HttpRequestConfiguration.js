/**
*  HttpRequestConfiguration
*
*/
var HttpRequestConfiguration = function(name, method, uri) {
    var httpRequest = new HttpRequest(method, uri);
    var eventRequest = {};
    var observers = [];
    var durationMax = 0;

    return {
        setAuthentication(username, password) {
            httpRequest.setAuthentication(username, password);
            return this;
        },
        setDurationMax(seconds) {
            durationMax = seconds*1000;
            return this;
        },
        addParams(params = {}) {
            for (key in params)
                this.addParam(key, params[key]);
            return this;
        },
        addParam(param, value) {
            httpRequest.addParam(param, value);
            return this;
        },
        addFilters(...filters) {
            for (filter of filters)
                this.addFilter(filter);
            return this;
        },
        addFilter(filter) {
            httpRequest.addFilter(filter);
            return this;
        },
        setEventRequest({
            init: eventInit,
            abort: eventAbort,
            success: eventSuccess,
            error: eventError,
            processingRequest: eventProcessingRequest
        }) {
            eventRequest.init = eventInit;
            eventRequest.abort = eventAbort;
            eventRequest.success = eventSuccess;
            eventRequest.error = eventError;
            eventRequest.processingRequest = eventProcessingRequest;
            return this;
        },
        addObserver(observer) {
            observers.push(observer);
            return this;
        },
        addCookie(nameCookie, valueCookie) {
            httpRequest.addCookie(nameCookie, valueCookie);
            return this;
        },
        execute() {
            var ajaxHttpRequest = new AjaxHttpRequest(name, durationMax, true);
            ajaxHttpRequest.setObservers(observers);
            ajaxHttpRequest.setEventRequest(eventRequest);
            ajaxHttpRequest.setHttpRequest(httpRequest);
            ajaxHttpRequest.sendRequest();
        },
        getURI() {
            return httpRequest.getURI();
        },
        getURIReal() {
            return httpRequest.getURIReal();
        }
    }
}
