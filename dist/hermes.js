/**
*   Hermes: Module AJAX
*   author: Alan Marquez Escorcia
*   since: 25/05/2018
*/
const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    HEAD: "HEAD",
    DELETE: "DELETE"
};

var Hermes = (function() {
    var httpConfigurationStorage;

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

    var HttpRequest = function(method, uri) {
        var params = [];
        var authentication = '';
        var headerHttp = {};
        var filters = [];
        var cookies = [];

        function toStringParams() {
            let total;
            params.forEach(
                (currentValue, currentIndex) => {
                    if (currentIndex === 0)
                        total = `${currentValue.param}=${currentValue.value}`;
                    else
                        total += `&${currentValue.param}=${currentValue.value}`;
                }
            );
            return total;
        }

        function toStringFilters() {
            let total = '';
            filters.forEach(
                (currentValue) => {
                    total += `/${currentValue}`;
                }
            )
            return total;
        }

        return {
            addCookie(nameCookie, valueCookie) {
                cookies.push({nameCookie, valueCookie});
            },
            setAuthentication(username, password) {
                authentication =  `${username}:${password}`;
            },
            addParam(param, value) {
                params.push({param, value});
            },
            setHeader(headers = {}) {
                headerHttp = headers;
            },
            addFilter(newFilter) {
                filters.push(newFilter);
            },
            setURI(newURI) {
                uri = newURI;
            },
            getHeader() {
                return headerHttp;
            },
            getParams() {
                return toStringParams();
            },
            getURI() {
                let decorateUri = (method === 'GET') ?
                `${uri}${toStringFilters()}?${toStringParams()}` :
                `${uri}${toStringFilters()}`;

                if(authentication!=='') {
                    let sepUri = decorateUri.split(/(http[s]*:\/\/)/i);
                    return `${sepUri[1]}${authentication}@${sepUri[2]}`;
                }
                return decorateUri;
            },
            getURIReal() {
                return uri;
            },
            getMethod() {
                return method;
            }
        };
    }

    var HttpConfigurationStorage = function() {
        var httpConfigurations = [];
        var lastHttpConfiguration;
        var configurationsNumber = 0;

        return {
            addConfiguration(index, configurationHttpRequest) {
                configurationsNumber++;
                lastHttpConfiguration = {index: index, content: configurationHttpRequest};
                httpConfigurations.push(lastHttpConfiguration);
                return lastHttpConfiguration.content;
            },
            getConfiguration(index) {
                var configurationHttpRequest = httpConfigurations
                                                    .find(configuration => configuration.index == index);
                if(configurationHttpRequest == null)
                    return configurationHttpRequest;
                return configurationHttpRequest.content;
            },
            deleteConfiguration(index) {
                httpConfigurations = httpConfigurations.filter(
                    configuration => configuration.index !== index
                );
                configurationsNumber = httpConfigurations.length;
            },
            getCount() {
                return configurationsNumber;
            },
            getLastConfigurationHttpRequest() {
                return lastHttpConfiguration.content;
            }
        };
    }

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
            if(HttpRequest.getMethod === 'POST')
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

    return {
        newRequestAjax(name, method, uri, flag='prototype') {
            if(flag === 'prototype') {
                if(httpConfigurationStorage == null)
                    httpConfigurationStorage = new HttpConfigurationStorage()

                if(name == '')
                    name = 'AjaxRequest'+httpConfigurationStorage.getCount()+1;

                return httpConfigurationStorage
                    .addConfiguration(name, new HttpRequestConfiguration(name, method, uri))
            } else {
                return new HttpRequestConfiguration(name, method, uri);
            }
        },
        getRequestPrevious(name='') {
            if(name !== '')
                return httpConfigurationStorage.getConfiguration(name);
            return httpConfigurationStorage.getLastConfigurationHttpRequest();
        },
        deleteRequestPrevious(name='') {
            if(name !== '')
                return httpConfigurationStorage.deleteConfiguration(name);
            return httpConfigurationStorage.deleteConfiguration(
                httpConfigurationStorage.getCount()
            );
        },
        getCount() {
            httpConfigurationStorage.getCount();
        }
    };
})();
