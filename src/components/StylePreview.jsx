import React from 'react';
import { StyleRender } from '../utils/StyleRender';

export default class StylePreview extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {style: props.style};
    }

    render() {
        return <canvas width="20" height="20" ref={canvas => this.canvas = canvas} style={{ verticalAlign: "middle" }}></canvas>
    }

    componentDidMount() {
        StyleRender.render(this.state.style, this.canvas);
    }

    componentDidUpdate() {
        StyleRender.render(this.state.style, this.canvas);
    }
}