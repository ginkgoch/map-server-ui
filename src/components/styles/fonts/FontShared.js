import _ from 'lodash';

export const minSelectWidth = 180;

export const defaultFontStyles = ['normal', 'italic', 'oblique'];

export const defaultFontWeights = ['normal', 'bold', 'bolder', 'light'];

const defaultFontComponents = {fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, fontFamily: 'Arial' };
export const parseFontComponents = function (font) {
    const result = Object.assign({}, defaultFontComponents);

    if (!font) return result;

    const replaceSpace = s => s.replace(/\s+/g, ' ');
    const fontStyleReg = /(normal|italic|oblique)\s+/g;
    const fontStyle = font.match(fontStyleReg);
    if (fontStyle && fontStyle.length > 0) {
        result.fontStyle = fontStyle[0].trim();
        font = font.replace(fontStyleReg, '');
        font = replaceSpace(font);
    }

    const fontWeightReg = /(normal|bold|bolder|light)\s+/g;
    const fontWeight = font.match(fontWeightReg);
    if (fontWeight && fontWeight.length > 0) {
        result.fontWeight = fontWeight[0].trim();
        font = font.replace(fontWeightReg, '');
        font = replaceSpace(font);
    }

    const fontSizeReg = /\d+px/g;
    const fontSize = font.match(fontSizeReg);
    if (fontSize && fontSize.length > 0) {
        result.fontSize = parseInt(fontSize[0]);
        font = font.replace(fontSizeReg, '');
        font = replaceSpace(font);
    }

    font = font.trim();
    if (font.length > 0) {
        result.fontFamily = font;
    }

    return result;
}

export const stringifyFontComponents = fontComponents => {
    fontComponents = _.defaults(fontComponents, defaultFontComponents);
    fontComponents = _.pick(fontComponents, ['fontStyle', 'fontWeight', 'fontSize', 'fontFamily']);
    return Object.values(fontComponents).filter(f => f !== 'normal').map(f => {
        if (typeof f === 'number') {
            return f + 'px';
        }

        return f;
    }).join(' ');
};

export const FontUtils = {
    parseFontComponents,
    stringifyFontComponents
}