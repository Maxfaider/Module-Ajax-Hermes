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
            return lastHttpConfiguration;
        },
        getConfiguration(index) {
            return httpConfigurations.find(
                configuration => configuration.index == index
            );
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
            return lastHttpConfiguration;
        }
    };
}
