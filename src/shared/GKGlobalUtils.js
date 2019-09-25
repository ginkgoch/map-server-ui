import _ from "lodash";
import { GKGlobal } from ".";

export class GKGlobalUtils {
    static getLayerInfo(layerID) {
        return GKGlobal.current.layerInfos.find(layerInfo => layerInfo.id === layerID)
    }

    static updateLayerInfo(layerInfo) {
        let layerIndex = _.findIndex(GKGlobal.current.layerInfos, l => l.id === layerInfo.id);
        if (layerIndex < 0) {
            GKGlobal.current.layerInfos.push(layerInfo);
        }
        else {
            GKGlobal.current.layerInfos.splice(layerIndex, 1, layerInfo);
        }
    }

    static updateLayerInfos(layerInfos) {
        if (layerInfos.length > 0) {
            layerInfos.forEach(layerInfo => this.updateLayerInfo(layerInfo));
        }
    }

    static removeLayerInfo(layerID) {
        let layerIndex = _.findIndex(GKGlobal.current.layerInfos, l => l.id === layerID);
        if (layerIndex >= 0) {
            GKGlobal.current.layerInfos.splice(layerIndex, 1);
        }
    }
}