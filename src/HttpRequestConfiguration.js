/**
*  HttpRequestConfiguration
*
*/
var HttpRequestConfiguration = function(method, uri) {
    var httpRequest = new HttpRequest(method, uri);
    var eventRequest = {};
    var observers = [];
    var durationMax;

    return {
        setAuthentication(username, password) {
            httpRequest.setAuthentication(username, password);
            return this;
        },
        setDurMax(seconds) {
            durationMax = seconds;
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
            success: eventSuccess,
            error: eventError,
            processingRequest: eventProcessingRequest
        }) {
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
            console.log(eventRequest.error(401) + ' ' + eventRequest.success(this.getURIReal()));
        },
        getURI() {
            return httpRequest.getURI();
        },
        getURIReal() {
            return httpRequest.getURIReal();
        }
    }
}
