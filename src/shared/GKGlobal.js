import _ from "lodash";
import { Config } from ".";

export class GKGlobal {
    static init(root = undefined) {
        GKGlobal.root = root || window;
        GKGlobal.root.GKGlobalData = {};
        this.assign(Config);
        this.assign({ layerInfos: [] });
    }

    static get state() {
        return this.root.GKGlobalData;
    }

    static assign(options) {
        this.root.GKGlobalData = Object.assign(this.root.GKGlobalData, options);
    }
}