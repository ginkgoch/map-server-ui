export const Config = {
    serviceRoot: 'http://localhost:3000',
    serviceUrl: path => {
        return [Config.serviceRoot.replace(/\/$/i, ''), path.replace(/^\//i, '')].join('/');
    }
}