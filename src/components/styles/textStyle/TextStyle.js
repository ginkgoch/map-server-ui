import React, { Component } from 'react';
import ColorPicker from "rc-color-picker";
import { StyleBaseForm } from '../StyleBase';
import { Form } from 'antd';
import { TextFieldSelect } from './TextFieldSelect';
import { hexColorWithAlpha } from '../KnownColors';
import { FontFamilySelect, FontSizeInput, FontStyleSelect, FontWeightSelect } from '../fonts';
import { MapsService } from "../../../services";

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
            await this.reloadFields();
        }
    }

    renderContent() {
        return <TextStyleFormItems style={this.state.style}
            fields={this.state.fields}
            onFontChange={this.onFontChange.bind(this)}
            onContentChange={this.onContentChange.bind(this)}
            onTextColorChange={this.onTextColorChange.bind(this)} />
    }

    onContentChange(newContent) {
        this.props.style.content = newContent;
        this.setState({ style: this.props.style });
    }

    onTextColorChange(newColor) {
        this.props.style.fillStyle = this.getColor(newColor);
        this.setState({ style: this.props.style });
    }

    onFontChange(newFont) {
        this.props.style.font = newFont;
        this.setState({ style: this.props.style });
    }

    async reloadFields() {
        const response = await MapsService.getFields(
            this.props.layerID,
            this.props.groupID,
            this.props.mapID,
            {
                fields: ["name", "type"]
            }
        );
        if (response.status === 200) {
            const fields = response.data.map(f => f.name);
            let selectedField = fields.length > 0 ? fields[0] : undefined;
            this.setState({ fields, selectedField, shouldReloadFields: false });
        } else {
            console.error(response.data);
            this.setState({
                fields: [],
                selectedField: undefined,
                shouldReloadFields: false
            });
        }
    }
}

export const TextStyleFormItems = props => {
    const textColor = hexColorWithAlpha(props.style.fillStyle);
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
                defaultColor={textColor.hex}
                defaultAlpha={textColor.alpha}
                onChange={newColor => props.onTextColorChange(newColor)}
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
    </>
}

export const TextStyle = Form.create({name: 'TextStyle'})(TextStyleForm);

