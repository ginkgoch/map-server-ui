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
    
    /**
    * 
    * @param {*} layerID 
    * @param {*} groupID 
    * @param {*} mapID 
    * @param {fields: string, from: number, limit: number} filter
    */
   static async getProperties(layerID, groupID, mapID, filter = undefined) {
       const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}/properties`, filter);
       return response;
   }

   /**
    * 
    * @param {*} layerID 
    * @param {*} groupID 
    * @param {*} mapID 
    * @param {fields: string, types: string} filter 
    */
   static async getFields(layerID, groupID, mapID, filter = undefined) {
       const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}/fields`, filter);
       return response;
   }

   static async getPropertyByField(field, layerID, groupID, mapID) {
       const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}/properties/${field}`);
       return response;
   }

   /**
    * 
    * @param {*} field 
    * @param {*} layerID 
    * @param {*} groupID 
    * @param {*} mapID 
    * @param {string[]} aggregators Options are min, max, avg, count and distinct.
    */
   static async getAggregatedPropertyByField(field, layerID, groupID, mapID, aggregators) {
       const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}/properties/${field}`, { aggregators });
       return response;
   }
}