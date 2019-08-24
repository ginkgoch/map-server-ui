import React from 'react';
import ColorPicker from "rc-color-picker";
import { Form, InputNumber } from "antd";
import { hexColor } from './KnownColors';
import { StyleBase } from './StyleBase';

export class LineStyle extends StyleBase {
    renderContent() {
        return <LineStyleFormItems style={this.state.style} 
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)} />
    }
}

export const LineStyleFormItems = props => {
    return <>
        <Form.Item label="Stroke">
            <ColorPicker color={hexColor(props.style.strokeStyle)} className="color-picker" onChange={props.onStrokeStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke Width">
            <InputNumber min={0} value={props.style.lineWidth} onChange={props.onLineWidthChange}></InputNumber>
        </Form.Item>
    </>
};