import { hexToRgba, rgbaToHex } from "../src/shared";

describe('Colors', () => {
    it('hexToRgba', () => {
        let rgba = hexToRgba('#ffffff');
        expect(rgba).toEqual('rgba(255, 255, 255, 1)');

        rgba = hexToRgba('#ffffff', 50);
        expect(rgba).toEqual('rgba(255, 255, 255, 0.5)');
    });

    it('rgbaToHex', () => {
        let hex = rgbaToHex('rgba(255, 255, 255, 0.5)');
        expect(hex.hex).toEqual('#ffffff');
        expect(hex.alpha).toEqual(50);

        hex = rgbaToHex('rgba(255, 255, 255)');
        expect(hex.hex).toEqual('#ffffff');
        expect(hex.alpha).toEqual(100);
    });
});