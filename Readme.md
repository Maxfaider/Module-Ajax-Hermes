# Hermes

> Simple module AJAX

<p align="center">
    <img src="docs/img/hermes.jpg" alt="Hermes-image" />
</p>

Simple Ajax module to send HTTP queries, which simplifies and allows you to develop your projects, without having to worry about low level processes.

- Requests: POST, GET, HEAD, PUT and DELETE

- Request control: Storage, Observer, asynchronous

- URL formats:
    >   Add Params
    >   https://example.com/index.php?param1=value1&param2=value2&param3=value3
    >
    >   Add Filters
    >   https://example.com/index.php/find/user/employee?param1=value1
    >
    >   Add Authentication
    >   https://username:password@example.com/index.php/access/

### Develoment View


<p align="center">
    <img src="docs/img/Develoment-View.png" alt="Develoment-View" />
</p>

### Logical View
![Logical-View](docs/img/Logical-View.png)

### How to use

```html
<script src="js/hermes.min.js"></script>
```

```js
var httpRequestConfigurations = Hermes.newRequestAjax(
    'register-user',
    METHOD.GET,
    'http://localhost/testHermes/'
);

httpRequestConfiguration
    .addFilters('register','user')
    .addParam('bar', 'foo')
    .setDurationMax(5)
    .setEventRequest({
        init() {
            console.log('init data...')
        },
        abort() {
            console.log('Transfer to exceeded the established time...');
        },
        success(responseHttp) {
            console.log('Response: ' + responseHttp.responseText);
        },
        error(errorMessage, errorCode) {
            console.log('Error: ' + errorMessage + ' ' + errorCode);
        },
        processingRequest() {
            console.log('processing Request...')
        }
    })
    .addObserver({
        notify(nameRequest, InfoRequest) {
            console.log('observer' + nameRequest + ' ' + InfoRequest)
        }
    })
    .execute();

//request http: http://localhost/testHermes/register/user?bar=foo

Hermes.getRequestPrevious('register-user')
    .addParams({param1: value1, param2: value2})
    .addCookie('preferences', 'javascript');
    .setAuthentication('Maxfaider', 'tutorhgids')
    .excute();

//request http: http://Maxfaider:tutorhgids@localhost/testHermes/register/user?bar=foo&param1=value1&param2=value2
```


![vanilla-js](docs/img/vanillajs.png)
