import { GKGlobalData } from "../../src/shared";

describe('GKGlobal', () => {
    it('init', () => {
        GKGlobalData.init({});
        expect(GKGlobalData.current).not.toBeUndefined();
        expect(GKGlobalData.current.layerInfos).not.toBeUndefined();
        expect(GKGlobalData.current.layerInfos.length).toBe(0);
    });

    it('assign', () => {
        GKGlobalData.init({});
        GKGlobalData.assign({ name: 'Ginkgoch' });
        expect(GKGlobalData.current.name).toEqual('Ginkgoch');
    });

    it('layerInfos', () => {
        GKGlobalData.init({});
        let layerInfo = GKGlobalData.getLayerInfo('hhhh');
        expect(layerInfo).toBeUndefined();

        GKGlobalData.updateLayerInfo({ id: 'layer1', name: 'layer1_name' });
        expect(GKGlobalData.current.layerInfos.length).toBe(1);

        layerInfo = GKGlobalData.getLayerInfo('layer1');
        expect(layerInfo.name).toEqual('layer1_name');

        GKGlobalData.updateLayerInfo({ id: 'layer2', name: 'layer2_name' });
        expect(GKGlobalData.current.layerInfos.length).toBe(2);

        layerInfo = GKGlobalData.getLayerInfo('layer2');
        expect(layerInfo.name).toEqual('layer2_name');

        GKGlobalData.updateLayerInfo({ id: 'layer1', name: 'layer1_name1' });
        expect(GKGlobalData.current.layerInfos.length).toBe(2);

        layerInfo = GKGlobalData.getLayerInfo('layer1');
        expect(layerInfo.name).toEqual('layer1_name1');
    });
});