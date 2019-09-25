import { GKGlobal, GKGlobalUtils } from "../../src/shared";

describe('GKGlobal', () => {
    it('init', () => {
        GKGlobal.init({});
        expect(GKGlobal.state).not.toBeUndefined();
        expect(GKGlobal.state.layerInfos).not.toBeUndefined();
        expect(GKGlobal.state.layerInfos.length).toBe(0);
    });

    it('assign', () => {
        GKGlobal.init({});
        GKGlobal.assign({ name: 'Ginkgoch' });
        expect(GKGlobal.state.name).toEqual('Ginkgoch');
    });

    it('layerInfos', () => {
        GKGlobal.init({});
        let layerInfo = GKGlobalUtils.getLayerInfo('hhhh');
        expect(layerInfo).toBeUndefined();

        GKGlobalUtils.updateLayerInfo({ id: 'layer1', name: 'layer1_name' });
        expect(GKGlobal.state.layerInfos.length).toBe(1);

        layerInfo = GKGlobalUtils.getLayerInfo('layer1');
        expect(layerInfo.name).toEqual('layer1_name');

        GKGlobalUtils.updateLayerInfo({ id: 'layer2', name: 'layer2_name' });
        expect(GKGlobal.state.layerInfos.length).toBe(2);

        layerInfo = GKGlobalUtils.getLayerInfo('layer2');
        expect(layerInfo.name).toEqual('layer2_name');

        GKGlobalUtils.updateLayerInfo({ id: 'layer1', name: 'layer1_name1' });
        expect(GKGlobal.state.layerInfos.length).toBe(2);

        layerInfo = GKGlobalUtils.getLayerInfo('layer1');
        expect(layerInfo.name).toEqual('layer1_name1');
    });
});