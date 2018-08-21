var HttpRequest = function(method, uri) {
    var params = [];
    var authentication = '';
    var headerHttp = {};
    var filters = [];
    var cookies = [];

    function toStringParams() {
        let concatParams = '';
        params.forEach(
            (currentValue, currentIndex) => {
                if (currentIndex === 0)
                    concatParams = `${currentValue.param}=${currentValue.value}`;
                else
                    concatParams += `&${currentValue.param}=${currentValue.value}`;
            }
        );
        return concatParams;
    }

    function tostringCookies() {
        let concatCookies = '';
        params.forEach(
            (currentValue, currentIndex) => {
                if (currentIndex === 0)
                    concatCookies = `${currentValue.param}=${currentValue.value}`;
                else
                    concatCookies += `;${currentValue.param}=${currentValue.value}`;
            }
        );
        return concatCookies;
    }

    function toStringFilters() {
        let concatFilters = '/';
        filters.forEach(
            (currentValue) => {
                concatFilters += `${currentValue}/`;
            }
        )
        return concatFilters;
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
        addHeader(header, value) {
            headerHttp[header] = value;
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
        getCookies() {
            return tostringCookies();
        },
        getFilters() {
            return toStringFilters();
        },
        getURIReal() {
            return uri;
        },
        getMethod() {
            return method;
        }
    };
}
