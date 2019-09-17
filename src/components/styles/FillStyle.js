import React from 'react';
import { Form, InputNumber } from "antd";
import ColorPicker from "rc-color-picker";
import { hexColorWithAlpha } from './KnownColors';
import { StyleBaseForm } from './StyleBase';

class FillStyleForm extends StyleBaseForm {
    renderContent() {
        return <FillStyleFormItems 
            style={this.state.style}
            onFillStyleChange={this.onFillStyleChange.bind(this)}
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)} />
    }
}

export const FillStyleFormItems = props => {
    const fillStyleHex = hexColorWithAlpha(props.style.fillStyle);
    const strokeStyleHex = hexColorWithAlpha(props.style.strokeStyle);

    return <>
        <Form.Item label="Fill">
            <ColorPicker color={fillStyleHex.hex} alpha={fillStyleHex.alpha} className="color-picker" onChange={props.onFillStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke">
            <ColorPicker color={strokeStyleHex.hex} alpha={strokeStyleHex.alpha} className="color-picker" onChange={props.onStrokeStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke Width">
            <InputNumber min={0} defaultValue={props.style.lineWidth} onChange={props.onLineWidthChange}></InputNumber>
        </Form.Item>
    </>
};

export const FillStyle = Form.create({name: 'FillStyle'})(FillStyleForm);