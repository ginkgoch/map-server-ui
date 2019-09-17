import React from 'react';
import { StyleBaseForm } from './StyleBase';
import { Form, Select, InputNumber } from 'antd';
import ColorPicker from "rc-color-picker";
import { hexColorWithAlpha } from './KnownColors';

class PointStyleForm extends StyleBaseForm {
    renderContent() {
        return <PointStyleFormItems style={this.state.style}
            onSymbolChanged={this.onSymbolChanged.bind(this)}
            onFillStyleChange={this.onFillStyleChange.bind(this)}
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)}
            />
    }

    onSymbolChanged(value) {
        this.state.style.symbol = value;
        this.setState(this.state);
    }
}

export const PointStyleFormItems = props => {
    const fillStyleHex = hexColorWithAlpha(props.style.fillStyle);
    const strokeStyleHex = hexColorWithAlpha(props.style.strokeStyle);

    return <>
        <Form.Item label="Symbol">
            <Select defaultValue={props.style.symbol} onChange={props.onSymbolChanged}>
                <Select.Option value="rect">Rectangle</Select.Option>
                <Select.Option value="square">Square</Select.Option>
                <Select.Option value="circle">Circle</Select.Option>
            </Select>
        </Form.Item>
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

export const PointStyle = Form.create({name: 'PointStyle'})(PointStyleForm);