import _ from "lodash";
import { Config } from ".";

export class GKGlobalData {
    static init(root = undefined) {
        GKGlobalData.state = root || window;
        GKGlobalData.state.GKGlobal = {};
        this.assign(Config);
        this.assign({ layerInfos: [] });
    }

    static get current() {
        return this.state.GKGlobal;
    }

    static assign(options) {
        this.state.GKGlobal = Object.assign(this.state.GKGlobal, options);
    }

    static getLayerInfo(layerID) {
        return this.state.GKGlobal.layerInfos.find(layerInfo => layerInfo.id === layerID)
    }

    static updateLayerInfo(layerInfo) {
        let layerIndex = _.findIndex(this.state.GKGlobal.layerInfos, l => l.id === layerInfo.id);
        if (layerIndex < 0) {
            this.state.GKGlobal.layerInfos.push(layerInfo);
        }
        else {
            this.state.GKGlobal.layerInfos.splice(layerIndex, 1, layerInfo);
        }
    }

    static updateLayerInfos(layerInfos) {
        if (layerInfos.length > 0) {
            layerInfos.forEach(layerInfo => this.updateLayerInfo(layerInfo));
        }
    }

    static removeLayerInfo(layerID) {
        let layerIndex = _.findIndex(this.state.GKGlobal.layerInfos, l => l.id === layerID);
        if (layerIndex >= 0) {
            this.state.GKGlobal.layerInfos.splice(layerIndex, 1);
        }
    }
}