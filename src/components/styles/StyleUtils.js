import _ from "lodash";
import React from 'react';
import { FillStyleFormItems, LineStyleFormItems, PointStyleFormItems } from '.';
import { StyleTemplates } from "../../templates";

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
        const styleBase = StyleTemplates.getStyleBase(type);
        switch (type) {
            case 'fill-style':
                return StyleTemplates.assignFillStyle(styleBase);
            case 'line-style':
                return StyleTemplates.assignLineStyle(styleBase);
            case 'point-style':
                return StyleTemplates.assignPointStyle(styleBase);
            case 'class-break-style':
                return StyleTemplates.assignClassBreakStyle(styleBase);
            case 'value-style':
                return StyleTemplates.assignValueStyle(styleBase);
            default:
                return styleBase;
        }
    }

    static configureItems(style, props = undefined) {
        if (props === undefined) {
            props = {
                onFillStyleChange: color => {
                    style.fillStyle = color.color;
                },
                onStrokeStyleChange: color => {
                    style.strokeStyle = color.color;
                },
                onLineWidthChange: lineWidth => {
                    style.lineWidth = lineWidth;
                },
                onSymbolChanged: symbol => {
                    style.symbol = symbol;
                }
            };
        }

        switch (style.type) {
            case 'fill-style':
                return <FillStyleFormItems style={style} {...props} />;
            case 'line-style':
                return <LineStyleFormItems style={style} {...props} />;
            case 'point-style':
                return <PointStyleFormItems style={style} {...props} />;
            default:
                return null;
        }
    }

    static simpleStyleTypes() {
        return ['fill-style', 'line-style', 'point-style'];
    }

    static allStyleTypes() {
        return [...this.simpleStyleTypes(), 'class-break-style', 'value-style'];
    }

    static getConfiguringFormItems(style) {
        const props = {
            onFillStyleChange: color => {
                style.fillStyle = color.color;
            },
            onStrokeStyleChange: color => {
                style.strokeStyle = color.color;
            },
            onLineWidthChange: lineWidth => {
                style.lineWidth = lineWidth;
            },
            onSymbolChanged: symbol => {
                style.symbol = symbol;
            }
        };
        return this.configureItems(style, props);
    }

    static getScaleMarks() {
        const markLabelStyle = { transform: 'rotate(25deg)', marginTop: 10, fontSize: 10 };
        const marks = {
            1: { style: markLabelStyle, label: 'The Earth', },
            4: { style: markLabelStyle, label: 'Continent', },
            7: { style: markLabelStyle, label: 'Large Rivers', },
            11: { style: markLabelStyle, label: 'Large Roads', },
            16: { style: markLabelStyle, label: 'Buildings' },
        };
        return marks;
    }
}