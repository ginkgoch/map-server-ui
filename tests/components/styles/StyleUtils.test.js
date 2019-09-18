import { StyleUtils } from "../../../src/components/styles";

describe('StyleUtils', () => {
    it('Get scale by level ID ', () => {
        let scale = StyleUtils.getScaleByZoomLevelID(0);
        expect(scale).toEqual(StyleUtils.defaultMaximumScale);

        scale = StyleUtils.getScaleByZoomLevelID(1);
        expect(scale).toEqual(StyleUtils.defaultMaximumScale * .5);

        scale = StyleUtils.getScaleByZoomLevelID(19);
        expect(scale).toEqual(StyleUtils.defaultMaximumScale / Math.pow(2, 19));

        scale = StyleUtils.getScaleByZoomLevelID(25);
        expect(scale).toEqual(StyleUtils.defaultMaximumScale / Math.pow(2, 19));

        scale = StyleUtils.getScaleByZoomLevelID(-2);
        expect(scale).toEqual(StyleUtils.defaultMaximumScale);
    });

    it('Get level ID by scale', () => {
        let levelID = StyleUtils.getZoomLevelIDByScale(Number.MAX_SAFE_INTEGER);
        expect(levelID).toEqual(0);

        levelID = StyleUtils.getZoomLevelIDByScale(-1);
        expect(levelID).toEqual(19);
    });
});