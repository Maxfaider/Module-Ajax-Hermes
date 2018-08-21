/**
* HttpConfigurationStorage
*
**/
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
            if(configurationHttpRequest == undefined)
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
