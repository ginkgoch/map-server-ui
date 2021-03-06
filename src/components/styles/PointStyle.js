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
            onRadiusChange={this.onRadiusChange.bind(this)}
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
            <ColorPicker defaultColor={fillStyleHex.hex} defaultAlpha={fillStyleHex.alpha} className="color-picker" onChange={props.onFillStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke">
            <ColorPicker defaultColor={strokeStyleHex.hex} defaultAlpha={strokeStyleHex.alpha} className="color-picker" onChange={props.onStrokeStyleChange}></ColorPicker>
        </Form.Item>
        <Form.Item label="Stroke Width">
            <InputNumber min={0} defaultValue={props.style.lineWidth} onChange={props.onLineWidthChange}></InputNumber>
        </Form.Item>
        <Form.Item label="Radius">
            <InputNumber min={1} defaultValue={props.style.radius} onChange={props.onRadiusChange}></InputNumber>
        </Form.Item>
    </>
};

export const PointStyle = Form.create({name: 'PointStyle'})(PointStyleForm);