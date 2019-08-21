export class StyleRender {
    static render(style, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.antialias = 'none';
        _.assign(ctx, style);

        switch (style.type) {
            case 'fill-style':
                this.renderFillStyle(ctx, canvas.width, canvas.height);
                break;
            case 'line-style':
                this.renderLineStyle(ctx, canvas.width, canvas.height);
                break;
            case 'point-style':
                this.renderPointStyle(ctx, canvas.width, canvas.height, style);
                break;
        }
    }

    static renderFillStyle(ctx, width, height) {
        this._renderPointRect(ctx, width, height);
    }
    
    static renderLineStyle(ctx, width, height) {
        ctx.strokeRect(2, 2, width - 4, height - 4);
    }
    
    static renderPointStyle(ctx, width, height, style) {
        if (style.symbol === 'rect' || style.symbol === 'square') {
            this._renderPointRect(ctx, width, height);
        } else {
            this._renderPointCircle(ctx, width, height);
        }
    }
    
    static _renderPointRect(ctx, width, height) {
        ctx.fillRect(2, 2, width - 4, height - 4);
        ctx.strokeRect(2, 2, width - 4, height - 4);
    }
    
    static _renderPointCircle(ctx, width, height) {
        ctx.beginPath();
        const radius = Math.min(width, height) * .5 - 2;
        ctx.arc(width * .5, height * .5, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
    
        ctx.fill();
        ctx.stroke();
    }
}