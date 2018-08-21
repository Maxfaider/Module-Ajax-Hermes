# Hermes

> Simple module AJAX

<p align="center">
    <img src="docs/img/hermes.jpg" alt="Hermes-image" />
</p>

Hermes is a lightweight JavaScript library built on XMLHttpRequest to make AJAX calls. It allows you to make HTTP requests from the browser and the server.

## Features

- Send HTTP requests: POST, GET, HEAD, PUT and DELETE.

- Control of HTTP requests:
    -   Storage of sent requests.
    -   Control of the duration of the request.
    -   Allows the implementation of observers for HTTP requests.
    -   Send Cookies.

- HTTP request configuration:
    -   Add parameters to the HTTP request:
    >   https://example.com/index.php?param1=value1&param2=value2&param3=value3

    -   Add filters to the HTTP request:
    >   https://example.com/index.php/filter1/filter2/filter3?param1=value1

    -   Add basic authentication:
    >   https://username:password@example.com/index.php/access/

### Develoment View

<p align="center">
    <img src="docs/img/Develoment-View.png" alt="Develoment-View" />
</p>

### Logical View
![Logical-View](docs/img/Logical-View.png)

## How To Use

### Manual installation

```html
<script src="js/hermes.min.js"></script>
```
### NPM

```console
npm i module-ajax-hermes
```

```js
var httpRequestConfigurations = Hermes.newRequestAjax(
    'register-user',
    METHOD.GET,
    'http://localhost/testHermes/'
);

httpRequestConfiguration
    .addHeader('Accept', 'application/json')
    .addFilters('register','user')
    .addParam('bar', 'foo')
    .setDurationMax(5) //seconds
    .setEventRequest({
        init() {
            console.log('init data...')
        },
        abort() {
            console.log('Transfer to exceeded the established time...');
        },
        success(responseHttp) {
            console.log(
                'Response: ' + responseHttp.responseText +
                '\nStatus: ' + responseHttp.status
            );
        },
        error(errorMessage, errorCode) {
            console.log('Error: ' + errorMessage + ' ' + errorCode);
        },
        processingRequest() {
            console.log('processing Request...');
        }
    })
    .addObserver({
        notify(nameRequest, infoRequest) {
            console.log('observer ' + nameRequest +
             '  isCompleted ' + infoRequest.completed +
             ' response ' + infoRequest.response
            );
        }
    })
    .execute();

//request http: http://localhost/testHermes/register/user?bar=foo

Hermes.getRequestPrevious('register-user')
    .addParams({param1: value1, param2: value2})
    .addCookie('preference', 'javascript') //custom Cookie-User: preference=javascript
    .addCookie('kind', 'typescript')
    .setAuthentication('Maxfaider', 'tutorhgids')
    .execute();

//request http: http://Maxfaider:tutorhgids@localhost/testHermes/register/user?bar=foo&param1=value1&param2=value2
```

```http
Header

Host: localhost
Connection: keep-alive
Content-Length: 7
Accept: application/json
Origin: http://localhost
Cookie-user: preference=javascript;kind=typescript
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36 OPR/54.0.2952.71
Referer: http://localhost/testHermes/Module-Ajax-Hermes/test/HttpConfigurationRequest.html
Accept-Encoding: gzip, deflate, br
Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
```

![vanilla-js](docs/img/vanillajs.png)
