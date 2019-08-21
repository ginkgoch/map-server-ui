import React from 'react';
import { Render } from './Render';

export default class StylePreview extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {style: props.style};
    }

    render() {
        return <canvas width="20" height="20" ref={canvas => this.canvas = canvas} style={{ verticalAlign: "middle" }}></canvas>
    }

    componentDidMount() {
        Render.renderStyle(this.state.style, this.canvas);
    }

    componentDidUpdate() {
        Render.renderStyle(this.state.style, this.canvas);
    }
}