import React from 'react';
import {Icon} from 'antd';
import { func } from 'prop-types';

export default class StyleItem extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const style = this.props.style;
        let ctx = this.canvas.getContext('2d');
        ctx.antialias = 'none';
        ctx = _.assign(ctx, style);

        renderStyle(ctx, style, this.canvas);
    }

    render() {
        const style = this.props.style;
        return (
            <div>
                <canvas width="20" height="20" ref={canvas => this.canvas = canvas} style={{ verticalAlign: "middle" }}></canvas> 
                <span className="style-label">{style.name}</span>
                <div style={{float: "right"}}>
                    <Icon type="close-square"></Icon>
                </div>
            </div>
        );
    }
}

function renderStyle(ctx, style, canvas) {
    switch (style.type) {
        case 'fill-style':
            renderFillStyle(ctx, canvas.width, canvas.height);
            break;
        case 'line-style':
            renderLineStyle(ctx, canvas.width, canvas.height);
            break;
        case 'point-style':
            renderPointStyle(ctx, canvas.width, canvas.height, style);
            break;
    }
}

function renderFillStyle(ctx, width, height) {
    _renderPointRect(ctx, width, height);
}

function renderLineStyle(ctx, width, height) {
    ctx.strokeRect(2, 2, width - 4, height - 4);
}

function renderPointStyle(ctx, width, height, style) {
    if (style.symbol === 'rect' || style.symbol === 'square') {
        _renderPointRect(ctx, width, height);
    } else {
        _renderPointCircle(ctx, width, height);
    }
}

function _renderPointRect(ctx, width, height) {
    ctx.fillRect(2, 2, width - 4, height - 4);
    ctx.strokeRect(2, 2, width - 4, height - 4);
}

function _renderPointCircle(ctx, width, height) {
    ctx.beginPath();
    const radius = Math.min(width, height) * .5 - 2;
    ctx.arc(width * .5, height * .5, radius, 0, 2 * Math.PI, false);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
}