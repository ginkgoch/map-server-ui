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
    static get defaultMaximumScale() {
        return 591659030.6768064;
    }

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

    /**
     * @param {number} levelID The zoom level ID where scale is at.
     * @param {({maximumScale: number, levelCount: number})} [options={ maximumScale: 591659030.6768064, levelCount: 20 }] The option to help to generate zoom levels scales.
     * @returns {number} The scale at a specific zoom level ID.
     */
    static getScaleByZoomLevelID(levelID, options = { maximumScale: 591659030.6768064, levelCount: 20 }) {
        const scales = this._getLevelScales(options.levelCount, options.maximumScale);
        if (levelID >= scales.length) {
            levelID = scales.length - 1;
        }
        else if (levelID < 0) {
            levelID = 0;
        }

        return scales[levelID];
    }

    /**
     * @param {number} scale The scale to locate the zoom level ID.
     * @param {({maximumScale: number, levelCount: number})} [options={ maximumScale: 591659030.6768064, levelCount: 20 }] The option to help to generate zoom levels scales.
     * @returns {number} The closed zoom level ID.
     */
    static getZoomLevelIDByScale(scale, options = { maximumScale: this.defaultMaximumScale, levelCount: 20 }) {
        const scales = this._getLevelScales(options.levelCount, options.maximumScale);
        const levelID = this._getSnappedZoomLevelID(scale, scales);
        return levelID;
    }

    static _getLevelScales(levelCount, maximumScale)  {
        const scales = [];

        let currentScale = maximumScale;
        while (scales.length < levelCount) {
            scales.push(currentScale);
            currentScale *= 0.5;
        }

        return scales;
    }

    static _getSnappedZoomLevelID(scale, scales) {
        let tempLevel = -1;
        let tempScaleDiff = Number.MAX_VALUE;
        for (let i = scales.length - 1; i >= 0; i--) {
            let current = scales[i];
            let currentDiff = Math.abs(current - scale);
            if (tempScaleDiff > currentDiff) {
                tempScaleDiff = currentDiff;
                tempLevel = i;
            }
        }

        return tempLevel;
    }
}