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
            return params;
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
        }
    };
}
