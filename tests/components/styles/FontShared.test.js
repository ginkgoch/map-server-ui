import { FontUtils } from "../../../src/components/styles/fonts";

describe('FontShared', () => {
    it('parseFontComponents', () => {
        const defaultComponent = {
            fontFamily: 'Arial',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
        };
        
        let fontComponent = FontUtils.parseFontComponents('');
        expect(fontComponent).toEqual(defaultComponent);

        fontComponent = FontUtils.parseFontComponents('Verdana');
        expect(fontComponent).toEqual(Object.assign(defaultComponent, { fontFamily: 'Verdana' }));

        fontComponent = FontUtils.parseFontComponents('24px Verdana');
        expect(fontComponent).toEqual(Object.assign(defaultComponent, { fontFamily: 'Verdana', fontSize: 24 }));

        fontComponent = FontUtils.parseFontComponents('bolder 24px Verdana');
        expect(fontComponent).toEqual(Object.assign(defaultComponent, { fontFamily: 'Verdana', fontSize: 24, fontWeight: 'bolder' }));

        fontComponent = FontUtils.parseFontComponents('italic bolder 24px Verdana');
        expect(fontComponent).toEqual(Object.assign(defaultComponent, { fontFamily: 'Verdana', fontSize: 24, fontWeight: 'bolder', fontStyle: 'italic' }));
    });

    it('stringifyFontComponents', () => {
        let components = {
            fontFamily: 'Arial',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
        };

        let font = FontUtils.stringifyFontComponents(undefined);
        expect(font).toEqual('12px Arial');

        font = FontUtils.stringifyFontComponents(components);
        expect(font).toEqual('12px Arial');

        font = FontUtils.stringifyFontComponents(Object.assign({}, components, { fontStyle: 'italic' }));
        expect(font).toEqual('italic 12px Arial');

        font = FontUtils.stringifyFontComponents(Object.assign({}, components, { fontWeight: 'light', fontStyle: 'italic' }));
        expect(font).toEqual('italic light 12px Arial');
    });
});