import _ from 'lodash';
import { uuid } from "../shared";
import { randomColor } from "../shared";

const STYLE_TYPE_FILL = 'fill-style';
const STYLE_TYPE_LINE = 'line-style';
const STYLE_TYPE_POINT = 'point-style';
const STYLE_TYPE_CLASS_BREAK = 'class-break-style';
const STYLE_TYPE_VALUE = 'value-style';

export class StyleTemplates {
    static getStyleBase(type, maximumScale = 1e11, minimumScale = 0) {
        return {
            "visible": true,
            "id": "style-" + uuid(),
            "type": type,
            "name": "",
            "maximumScale": maximumScale,
            "minimumScale": minimumScale
        };
    }

    static getFillStyle(fillStyle, strokeStyle, lineWidth, maximumScale = 1e10, minimumScale = 0) {
        let styleBase = this.getStyleBase(STYLE_TYPE_FILL, maximumScale, minimumScale);
        let style = this.getFillStyleFromStyleBase(fillStyle, strokeStyle, lineWidth, styleBase);
        return style;
    }

    static assignFillStyle(styleBase, fillStyle = undefined, strokeStyle = undefined, lineWidth = 1) {
        fillStyle = fillStyle || randomColor();
        strokeStyle = strokeStyle || randomColor();
        let style = _.assign(styleBase, {
            fillStyle, strokeStyle, lineWidth
        });

        return style;
    }

    static getLineStyle(strokeStyle, lineWidth, maximumScale = 1e10, minimumScale = 0) {
        let styleBase = this.getStyleBase(STYLE_TYPE_LINE, maximumScale, minimumScale);
        let style = this.assignLineStyle(styleBase, strokeStyle, lineWidth);
        return style;
    }

    static assignLineStyle(styleBase, strokeStyle = undefined, lineWidth = 1) {
        strokeStyle = strokeStyle || randomColor();
        let style = _.assign(styleBase, {
            strokeStyle, lineWidth
        });

        return style;
    }

    static getPointStyle(symbol = 'circle',
        fillStyle = undefined,
        strokeStyle = undefined,
        lineWidth = 1,
        radius = 20,
        maximumScale = 1e10,
        minimumScale = 0) {

        let styleBase = this.getStyleBase(STYLE_TYPE_POINT, maximumScale, minimumScale);
        let style = this.assignPointStyle(styleBase, symbol, fillStyle, strokeStyle, lineWidth, radius);
        return style;
    }

    static assignPointStyle(styleBase,
        symbol = 'circle',
        fillStyle = undefined,
        strokeStyle = undefined,
        lineWidth = 1,
        radius = 20) {

        fillStyle = fillStyle || randomColor();
        strokeStyle = strokeStyle || randomColor();

        let style = _.assign(styleBase, {
            symbol, fillStyle, strokeStyle, lineWidth, radius
        });

        return style;
    }

    static getClassBreakStyle(field = '', classBreaks = [], maximumScale = 1e10, minimumScale = 0) {
        let styleBase = this.getStyleBase(STYLE_TYPE_CLASS_BREAK, maximumScale, minimumScale);
        let style = this.assignClassBreakStyle(styleBase, field, classBreaks);
        return style;
    }

    static assignClassBreakStyle(styleBase, field = '', classBreaks = []) {
        let style = _.assign(styleBase, {
            field, classBreaks
        });

        return style;
    }

    static getClassBreak(minimum, maximum, style) {
        return {
            minimum, maximum, style
        };
    }

    static getValueStyle(field = '', items = [], maximumScale = 1e10, minimumScale = 0) {
        let styleBase = this.getStyleBase(STYLE_TYPE_VALUE, maximumScale, minimumScale);
        let style = this.assignValueStyle(styleBase, field, items);
        return style;
    }

    static assignValueStyle(styleBase, field = '', items = []) {
        let style = _.assign(styleBase, {
            field, items
        });

        return style;
    }

    static getValueItem(value, style) {
        return {
            value, style
        };
    }
}