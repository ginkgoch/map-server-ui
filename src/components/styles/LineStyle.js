import React from 'react';
import ColorPicker from "rc-color-picker";
import { Form, InputNumber } from "antd";
import { hexColorWithAlpha } from './KnownColors';
import { StyleBaseForm } from './StyleBase';

class LineStyleForm extends StyleBaseForm {
    renderContent() {
        return <LineStyleFormItems style={this.state.style} 
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)} />
    }
}

export const LineStyleFormItems = props => {
    const strokeStyleHex = hexColorWithAlpha(props.style.strokeStyle);

    return <>
        <Form.Item label="Stroke">
            <ColorPicker defaultColor={strokeStyleHex.hex} defaultAlpha={strokeStyleHex.alpha} className="color-picker" onChange={props.onStrokeStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke Width">
            <InputNumber min={0} defaultValue={props.style.lineWidth} onChange={props.onLineWidthChange}></InputNumber>
        </Form.Item>
    </>
};

export const LineStyle = Form.create({name: 'LineStyle'})(LineStyleForm);