import _ from "lodash";
import { Config } from ".";

export class GKGlobal {
    static init(root = undefined) {
        GKGlobal.state = root || window;
        GKGlobal.state.GKGlobalData = {};
        this.assign(Config);
        this.assign({ layerInfos: [] });
    }

    static get current() {
        return this.state.GKGlobalData;
    }

    static assign(options) {
        this.state.GKGlobalData = Object.assign(this.state.GKGlobalData, options);
    }

    static getLayerInfo(layerID) {
        return this.current.layerInfos.find(layerInfo => layerInfo.id === layerID)
    }

    static updateLayerInfo(layerInfo) {
        let layerIndex = _.findIndex(this.current.layerInfos, l => l.id === layerInfo.id);
        if (layerIndex < 0) {
            this.current.layerInfos.push(layerInfo);
        }
        else {
            this.current.layerInfos.splice(layerIndex, 1, layerInfo);
        }
    }

    static updateLayerInfos(layerInfos) {
        if (layerInfos.length > 0) {
            layerInfos.forEach(layerInfo => this.updateLayerInfo(layerInfo));
        }
    }

    static removeLayerInfo(layerID) {
        let layerIndex = _.findIndex(this.current.layerInfos, l => l.id === layerID);
        if (layerIndex >= 0) {
            this.current.layerInfos.splice(layerIndex, 1);
        }
    }
}