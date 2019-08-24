import React from 'react';
import { Form, InputNumber } from "antd";
import ColorPicker from "rc-color-picker";
import { hexColor } from './KnownColors';
import { StyleBase } from './StyleBase';

export class FillStyle extends StyleBase {
    renderContent() {
        return <FillStyleFormItems 
            style={this.state.style}
            onFillStyleChange={this.onFillStyleChange.bind(this)}
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)} />
    }
}

export const FillStyleFormItems = props => {
    return <>
        <Form.Item label="Fill">
            <ColorPicker color={hexColor(props.style.fillStyle)} className="color-picker" onChange={props.onFillStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke">
            <ColorPicker color={hexColor(props.style.strokeStyle)} className="color-picker" onChange={props.onStrokeStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke Width">
            <InputNumber min={0} value={props.style.lineWidth} onChange={props.onLineWidthChange}></InputNumber>
        </Form.Item>
    </>
};