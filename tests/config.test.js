import { Config } from "../src/shared";

describe('URL', () => {
    it('join', () => {
        let url = Config.serviceUrl('maps');
        expect(url).toEqual('http://localhost:3000/maps');

        url = Config.serviceUrl('/maps');
        expect(url).toEqual('http://localhost:3000/maps');
    });
});