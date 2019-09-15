import { Requests } from './shared/Requests';

export class DataSourcesService {
    static async getDataSources() {
        const response = await Requests.get('/dataSources');
        return response;
    }
}