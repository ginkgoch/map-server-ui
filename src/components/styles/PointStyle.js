import React from 'react';
import { StyleBase } from './StyleBase';
import { Form, Select, InputNumber } from 'antd';
import ColorPicker from "rc-color-picker";
import { hexColor } from './KnownColors';

export class PointStyle extends StyleBase {
    renderContent() {
        return (
            <>
                <Form.Item label="Symbol">
                    <Select defaultValue={this.state.style.symbol} onChange={this.onSymbolChanged.bind(this)}>
                        <Select.Option value="rect">Rectangle</Select.Option>
                        <Select.Option value="square">Square</Select.Option>
                        <Select.Option value="circle">Circle</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Fill">
                    <ColorPicker color={hexColor(this.state.style.fillStyle)} className="color-picker" onChange={this.onFillStyleChange.bind(this)}></ColorPicker>
                </Form.Item>
                <Form.Item label="Stroke">
                    <ColorPicker color={hexColor(this.state.style.strokeStyle)} className="color-picker" onChange={this.onStrokeStyleChange.bind(this)}></ColorPicker>
                </Form.Item>
                <Form.Item label="Stroke Width">
                    <InputNumber min={0} value={this.state.style.lineWidth} onChange={this.onLineWidthChange.bind(this)}></InputNumber>
                </Form.Item>
            </>
        );
    }

    onSymbolChanged(value) {
        this.state.style.symbol = value;
        this.setState(this.state);
    }
}