import _ from 'lodash';

export const minSelectWidth = 180;

export const defaultFontStyles = ['normal', 'italic', 'oblique'];

export const defaultFontWeights = ['normal', 'bold', 'bolder', 'light'];

const defaultFontComponents = {fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, fontFamily: 'Arial' };
export const parseFontComponents = function (font) {
    const result = Object.assign({}, defaultFontComponents);
    
    const fontSegments = font ? font.split(/\s+/g) : [];
    const segmentCount = fontSegments.length;
    if (segmentCount === 0) {
        return result;
    }

    if (segmentCount > 0) {
        result.fontFamily = fontSegments[segmentCount - 1];
    }

    if (segmentCount > 1) {
        const extraSegments = fontSegments.slice(0, segmentCount - 1);
        for (let segment of extraSegments) {
            if (/px$/g.test(segment)) {
                result.fontSize = parseInt(segment);
            }
            else if (defaultFontStyles.includes(segment)) {
                result.fontStyle = segment;
            }
            else if (defaultFontWeights.includes(segment)) {
                result.fontWeight = segment;
            }
        }
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