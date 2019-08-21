const padding = 2;

export class Render {
    static renderLayer(layer, canvas) {
        const styleCount = layer.styles.length;
        switch(styleCount) {
            case 0: {
                    const ctx = canvas.getContext('2d');
                    ctx.antialias = 'none';
                    ctx.strokeStyle = '#e0e0e0';
                    ctx.strokeRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
                }
                break;
            default:
                const count = styleCount > 4 ? 4 : styleCount;
                for (let i = 0; i < count; i++) {
                    const [x, y] = this._centerBy(i, canvas.width, canvas.height);
                    const s = _.cloneDeep(layer.styles[i]);
                    if (s.lineWidth !== undefined) {
                        s.lineWidth = 1;
                    }
                    this.renderStyle(s, canvas, x, y, canvas.width / 2, canvas.height / 2);
                }
                break;
        }
    }

    static renderStyle(style, canvas, x = undefined, y = undefined, w = undefined, h = undefined) {
        const ctx = canvas.getContext('2d');
        ctx.antialias = 'none';
        _.assign(ctx, style);

        w = w || canvas.width;
        h = h || canvas.height;

        switch (style.type) {
            case 'fill-style':
                this._renderFillStyle(ctx, w, h, x, y);
                break;
            case 'line-style':
                this._renderLineStyle(ctx, w, h, x, y);
                break;
            case 'point-style':
                this._renderPointStyle(ctx, w, h, style, x, y);
                break;
        }
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
}