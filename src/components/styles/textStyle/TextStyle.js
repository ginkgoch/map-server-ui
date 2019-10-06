import React, { Component } from 'react';
import ColorPicker from "rc-color-picker";
import { StyleBaseForm } from '../StyleBase';
import { Form, InputNumber } from 'antd';
import { TextFieldSelect } from './TextFieldSelect';
import { hexColorWithAlpha } from '../KnownColors';
import { FontFamilySelect, FontSizeInput, FontStyleSelect, FontWeightSelect } from '../fonts';

export class TextStyleForm extends StyleBaseForm {
    constructor(props) {
        super(props);

        this.state = Object.assign(this.state, {
            fields: [],
            layerID: props.layerID,
            groupID: props.groupID,
            mapID: props.mapID,
            shouldReloadFields: false
        });
    }

    componentDidMount() {
        this.setState({ shouldReloadFields: true });
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (nextProps.layerID !== preState.layerID) {
            return Object.assign(preState, {
                shouldReloadFields: true,
                layerID: nextProps.layerID,
                groupID: nextProps.groupID,
                mapID: nextProps.mapID
            });
        }

        return null;
    }

    async componentDidUpdate() {
        if (this.state.shouldReloadFields) {
            await this.reloadFields(this.props.layerID, this.props.groupID, this.props.mapID);
        }
    }

    renderContent() {
        return <TextStyleFormItems style={this.state.style}
            fields={this.state.fields}
            onFontChange={this.onFontChange.bind(this)}
            onContentChange={this.onContentChange.bind(this)}
            onFillStyleChange={this.onFillStyleChange.bind(this)}
            onStrokeStyleChange={this.onStrokeStyleChange.bind(this)}
            onLineWidthChange={this.onLineWidthChange.bind(this)}
        />
    }

    onContentChange(newContent) {
        this.props.style.content = newContent;
        this.setState({ style: this.props.style });
    }

    onFillStyleChange(newColor) {
        this.props.style.fillStyle = this.getColor(newColor);
        this.setState({ style: this.props.style });
    }

    onFontChange(newFont) {
        this.props.style.font = newFont;
        this.setState({ style: this.props.style });
    }
}

export const TextStyleFormItems = props => {
    const fillColor = hexColorWithAlpha(props.style.fillStyle);
    const strokeColor = hexColorWithAlpha(props.style.strokeStyle);

    const fontProps = {
        font: props.style.font,
        onFontChange: newFont => props.onFontChange(newFont)
    }

    return <>
        <Form.Item label="Content">
            <TextFieldSelect content={props.style.content}
                fields={props.fields}
                onContentChange={newContent => props.onContentChange(newContent)}></TextFieldSelect>
        </Form.Item>
        <Form.Item label="Text Color">
            <ColorPicker className="color-picker"
                defaultColor={fillColor.hex}
                defaultAlpha={fillColor.alpha}
                onChange={newColor => props.onFillStyleChange(newColor)}
            />
        </Form.Item>
        <Form.Item label="Font Family">
            <FontFamilySelect {...fontProps} />
        </Form.Item>
        <Form.Item label="Font Size">
            <FontSizeInput {...fontProps} />
        </Form.Item>
        <Form.Item label="Font Style">
            <FontStyleSelect {...fontProps} />
        </Form.Item>
        <Form.Item label="Font Weight">
            <FontWeightSelect {...fontProps} />
        </Form.Item>
        <Form.Item label="Outline Color">
            <ColorPicker className="color-picker"
                defaultColor={strokeColor.hex}
                defaultAlpha={strokeColor.alpha}
                onChange={newColor => props.onStrokeStyleChange(newColor)}
            />
        </Form.Item>
        <Form.Item label="Outline Width">
            <InputNumber defaultValue={props.style.lineWidth} onChange={newWidth => props.onLineWidthChange(newWidth)} />
        </Form.Item>
    </>
}

export const TextStyle = Form.create({ name: 'TextStyle' })(TextStyleForm);

