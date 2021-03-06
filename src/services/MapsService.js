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

    static async getPropertyByField(field, layerID, groupID, mapID, aggregators = []) {
        const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}/properties/${field}`, { aggregators });
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

    /**
     * 
     * @param {number[]} geom 2 numbers means point [x, y], 4 numbers means envelope [minx, miny, maxx, maxy].
     * @param {string} geomSrs Geometry srs associated. 
     * @param {number} level Zoom level.
     * @param {number | string} mapID Map ID.
     * @param {string} outSrs The output geometry SRS.
     * @param {boolean} simplify Whether simplify the geometry based on rendering resolution. It can efficiently reduce the size transfer through network. Default value is true.
     */
    static async getIntersection(geom, geomSrs, level, mapID, outSrs, simplify = true) {
        const response = await Requests.get(`/maps/${mapID}/query/intersection`, {
            geom, geomSrs, level, outSrs, simplify
        });

        return response;
    }

    /**
     * 
     * @param {string | number} layerID The layer ID.
     * @param {string | number} groupID The parent group ID.
     * @param {string | number} mapID The parent map ID.
     * @param {string[]} fields The fields to include in the response.
     * @returns {any} The layer info.
     */
    static async getLayerInfo(layerID, groupID, mapID, fields = []) {
        const response = await Requests.get(`/maps/${mapID}/groups/${groupID}/layers/${layerID}`, { fields });
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error(response.data);
        }
    }

    /**
     * 
     * @param {string[] | number[]} layerIDs The layer IDs.
     * @param {string | number} groupID The parent group ID.
     * @param {string | number} mapID The parent map ID.
     * @param {string[]} fields The fields to include in the response.
     * @returns {Promise<any[]>} The layer info.
     */
    static async getLayersInfo(layerIDs, groupID, mapID, fields = ['id', 'name', 'type', 'envelope', 'geomType']) {
        return await Promise.all(layerIDs.map(layerID => {
            return this.getLayerInfo(layerID, groupID, mapID, fields);
        }))
    }
}