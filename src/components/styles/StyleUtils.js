import _ from "lodash";
import React from 'react';
import { uuid, randomColor } from "../shared";
import { FillStyleFormItems, LineStyleFormItems, PointStyleFormItems } from '.';

const styleTypes = new Map([
    ['fill-style', 'Fill Style'],
    ['line-style', 'Line Style'],
    ['point-style', 'Point Style'],
    ['icon-style', 'Icon Style'],
    ['class-break-style', 'Class Break Style'],
    ['value-style', 'Value Style']
]);

export class StyleUtils {
    static styleTypeName(styleOrType) {
        let styleType = styleOrType;
        if (typeof styleType !== 'string') {
            styleType = styleType.type;
        }
        if (styleTypes.has(styleType)) {
            return styleTypes.get(styleType);
        }

        return styleType;
    }

    static defaultStyle(type) {
        const general = {
            "visible": true,
            "id": "style-" + uuid(),
            "type": type,
            "name": "",
            "maximumScale": 10000000000,
            "minimumScale": 0
        };

        switch (type) {
            case 'fill-style':
                return _.assign(general, {
                    fillStyle: randomColor(),
                    strokeStyle: randomColor(),
                    lineWidth: 1
                });
            case 'line-style':
                return _.assign(general, {
                    strokeStyle: randomColor(),
                    lineWidth: 1
                });
            case 'point-style':
                return _.assign(general, {
                    symbol: 'circle',
                    fillStyle: randomColor(),
                    strokeStyle: randomColor(),
                    lineWidth: 1,
                    radius: 20
                });
            default:
                return general;
        }
    }

    static configureItems(style) {
        switch (style.type) {
            case 'fill-style':
                return <FillStyleFormItems style={style} />;
            case 'line-style':
                return <LineStyleFormItems style={style} />;
            case 'point-style':
                return <PointStyleFormItems style={style} />;
            default:
                return null;
        }
    }
}