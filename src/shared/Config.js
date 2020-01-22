export const Config = {
    serviceRoot: getHostEntryPoint(),
    serviceUrl: path => {
        return [Config.serviceRoot.replace(/\/$/i, ''), path.replace(/^\//i, '')].join('/');
    }
}

function getHostEntryPoint() {
    let location = window.location;
    return `${location.protocol}//${location.hostname}:3000`;
}