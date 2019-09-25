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
}