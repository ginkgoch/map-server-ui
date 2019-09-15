import _ from 'lodash';

const padding = 2;

export class Render {
    static renderLayer(layer, canvas) {
        this._clearCanvas(canvas);

        const styleCount = layer.styles.length;
        switch(styleCount) {
            case 0: 
                this._renderStyle(undefined, canvas);
                break;
            default:
                const styles = this._flatStylesInLayer(layer);
                this.renderStyles(styles, canvas);
                break;
        }
    }

    static renderStyles(styles, canvas) {
        this._clearCanvas(canvas);        

        const count = styles.length > 4 ? 4 : styles.length;
        for (let i = 0; i < count; i++) {
            const [x, y] = this._centerBy(i, canvas.width, canvas.height);
            const s = _.cloneDeep(styles[i]);
            if (s.lineWidth !== undefined) {
                s.lineWidth = 1;
            }
            this._renderStyle(s, canvas, x, y, canvas.width / 2, canvas.height / 2);
        }
    }

    static renderStyle(style, canvas) {
        this._clearCanvas(canvas);
         
        this._renderStyle(style, canvas);
    }

    static _renderStyle(style, canvas, x = undefined, y = undefined, w = undefined, h = undefined) {
        const ctx = canvas.getContext('2d');
        ctx.antialias = 'none';

        let styleType = 'Unknown';
        if (style !== undefined) {
            _.assign(ctx, style);
            styleType = style.type;
        }

        w = w || canvas.width;
        h = h || canvas.height;

        switch (styleType) {
            case 'fill-style':
            case 'general-style':
                this._renderFillStyle(ctx, w, h, x, y);
                break;
            case 'line-style':
                this._renderLineStyle(ctx, w, h, x, y);
                break;
            case 'point-style':
                this._renderPointStyle(ctx, w, h, style, x, y);
                break;
            case 'class-break-style':
            case 'value-style':
                this._renderComplexStyles(style, canvas);
                break;
            default:
                _.assign(ctx, { strokeStyle: '#e0e0e0', lineWidth: 1 });
                this._renderEmpty(ctx, w, h, x, y);
        }
    }

    static _renderEmpty(ctx, width, height, x = undefined, y = undefined) {
        this._renderLineStyle(ctx, width, height, x, y);
    }

    static _renderFillStyle(ctx, width, height, x = undefined, y = undefined) {
        this._renderPointRect(ctx, width, height, x, y);
    }
    
    static _renderLineStyle(ctx, width, height, x = undefined, y = undefined) {
        x = x || width / 2;
        y = y || height / 2;
        const rectX = x - width / 2 + padding;
        const rectY = y - height / 2 + padding;
        const rectW = width - padding * 2;
        const rectH = height - padding * 2;
        ctx.strokeRect(rectX, rectY, rectW, rectH);
    }
    
    static _renderPointStyle(ctx, width, height, style, x = undefined, y = undefined) {
        if (style.symbol === 'rect' || style.symbol === 'square') {
            this._renderPointRect(ctx, width, height, x, y);
        } else {
            this._renderPointCircle(ctx, width, height, x, y);
        }
    }
    
    static _renderPointRect(ctx, width, height, x = undefined, y = undefined) {
        x = x || width / 2;
        y = y || height / 2;
        const rectX = x - width / 2 + padding;
        const rectY = y - height / 2 + padding;
        const rectW = width - padding * 2;
        const rectH = height - padding * 2;
        ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.strokeRect(rectX, rectY, rectW, rectH);
    }
    
    static _renderPointCircle(ctx, width, height, x = undefined, y = undefined) {
        x = x || width / 2;
        y = y || height / 2;
        const radius = Math.min(width, height) * .5 - padding;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
    
        ctx.fill();
        ctx.stroke();
    }

    static _renderComplexStyles(style, canvas) {
        const styles = this._flatStyle(style);
        this.renderStyles(styles, canvas);
    }

    static _centerBy(i, width, height) {
        const bw = width / 2 + padding;
        const bh = height / 2 + padding;
        switch(i) {
            case 0:
                return [bw / 2, bh / 2];
            case 1:
                return [width / 2 - padding + bw / 2, bh / 2];
            case 2:
                    return [bw / 2, height / 2 - padding + bh / 2];
            case 3:
            default:
                return [width / 2 - padding + bw / 2, height / 2 - padding + bh / 2];
        }
    }

    static _flatStyle(style) {
        if (style.type === 'class-break-style') {
            return style.classBreaks.map(cb => cb.style);
        }
        else if (style.type === 'value-style') {
            return style.items.map(cb => cb.style);
        }
        else {
            return [style];
        }
    }

    static _flatStyles(styles) {
        return _.flatMap(styles, style => this._flatStyle(style));
    }

    static _flatStylesInLayer(layer) {
        return this._flatStyles(layer.styles);
    }

    static _clearCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}