import React from 'react';
import ColorPicker from "rc-color-picker";
import { Form, InputNumber } from "antd";
import { hexColor } from './KnownColors';
import { StyleBase } from './StyleBase';

export class LineStyle extends StyleBase {
    renderContent() {
        return <>
            <Form.Item label="Stroke">
                <ColorPicker color={hexColor(this.state.style.strokeStyle)} className="color-picker" onChange={this.onStrokeStyleChange.bind(this)}></ColorPicker>
            </Form.Item>
            <Form.Item label="Stroke Width">
                <InputNumber min={0} value={this.state.style.lineWidth} onChange={this.onLineWidthChange.bind(this)}></InputNumber>
            </Form.Item>
        </>
    }
}