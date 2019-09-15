import { Requests } from "./shared/Requests";

export class MapsService {
    static async create(name, crs, description) {
        const mapModel = {
            name,
            description,
            creator: 'Admin',
            content: {
                name,
                srs: crs
            }
        };

        const response = await Requests.post('/maps', mapModel);
        return response;
    }

    static async getMaps() {
        const response = await Requests.get('/maps');
        return response;
    }

    static async getMapByID(id) {
        const response = await Requests.get(`/maps/${id}`);
        return response;
    }

    static async updateMap(newMapModel) {
        const response = await Requests.put(`/maps/${newMapModel.id}`, newMapModel);
        return response;
    }

    static async deleteMapByID(id) {
        const response = await Requests.delete(`/maps/${id}`);
        return response;
    }
}