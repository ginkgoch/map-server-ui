import React, { Component } from 'react';
import { Slider } from "antd";
import { StyleUtils } from './StyleUtils';

export class LevelRange extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = this.props.style;
        const fromLevelID = StyleUtils.getZoomLevelIDByScale(style.maximumScale) + 1;
        const toLevelID = StyleUtils.getZoomLevelIDByScale(style.minimumScale) + 1;
        const styleMarks = StyleUtils.getScaleMarks();

        return (<Slider marks={styleMarks} min={1} max={20} defaultValue={[fromLevelID, toLevelID]} range onChange={value => this.onRangeChange(value)} />);
    }

    onRangeChange(value) {
        const fromScale = StyleUtils.getScaleByZoomLevelID(value[0] - 1);
        const toScale = StyleUtils.getScaleByZoomLevelID(value[1] - 1);
        this.props.onScaleRangeChange(fromScale, toScale);
    }
}