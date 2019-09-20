import { Requests } from "./shared/Requests";

export class UtilitiesService {

    /**
     * 
     * @param {string} fromColor Accept html, rgb and rgba color.
     * @param {string} toColor Accept html, rgb and rgba color.
     * @param {string} count Count must be greater than 1.
     */
    async getBreakDownColors(fromColor, toColor, count) {
        const postData = { fromColor, toColor, count };
        const response = await Requests.post(`/utilities/color/breakdown`, postData);
        return response;
    }
}