import 'rc-color-picker/assets/index.css';
import React, { Component } from 'react';
import { Form, Input, Button, Slider } from "antd";
import { StylePreview } from '../shared';
import { hexToRgba } from '../../shared';
import { StyleUtils } from './StyleUtils';

export class StyleBaseForm extends Component {
    constructor(props) {
        super(props);

        this.state = { style: props.style }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (preState.style !== nextProps.style) {
            return { style: nextProps.style };
        }

        return null;
    }

    render() {
        const colStyle = {
            labelCol: {
                xs: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 12 }
            }
        };

        const form = this.props.form;
        const { getFieldDecorator } = form;

        return (
            <Form layout="horizontal" {...colStyle}>
                <Form.Item label="Name">
                    {
                        getFieldDecorator('name', {
                            initialValue: this.state.style.name,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input style name.'
                                }
                            ]
                        })(<Input placeholder="Name" />)
                    }
                </Form.Item>
                {
                    this.renderContent()
                }
                <Form.Item label="Visible Range">
                    <small>Lower level means larger scale.</small>
                </Form.Item>
                <Form.Item labelCol={{ xs: { span: 4 } }} wrapperCol={{ xs: { span: 20, offset: 2 } }}>
                    <Slider marks={StyleUtils.getScaleMarks()} min={1} max={20} defaultValue={[1, 20]} range />
                </Form.Item>

                {
                    this.renderPreview()
                }
                <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
                    <Button style={{ marginRight: 8 }} onClick={this.props.onEditStyleCanceled}>Cancel</Button>
                    <Button type="primary" onClick={this.onSubmit.bind(this)}>Submit</Button>
                </Form.Item>
            </Form>
        );
    }

    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }

            this.state.style.name = values.name;
            this.props.onEditStyleSubmit(this.state.style)
            this.props.form.resetFields();
        })
    }

    renderContent() {
        return [];
    }

    renderPreview() {
        if (!this.state.hidePreview) {
            return (
                <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
                    <StylePreview style={this.state.style} width={60} height={60}></StylePreview>
                </Form.Item>
            );
        }

        return null;
    }

    onFillStyleChange(color) {
        this.state.style.fillStyle = this.getColor(color);
        this.setState(this.state.style);
    }

    onStrokeStyleChange(color) {
        this.state.style.strokeStyle = color.color;
        this.setState(this.state.style);
    }

    onLineWidthChange(lineWidth) {
        this.state.style.lineWidth = lineWidth;
        this.setState(this.state.style);
    }

    onNameChange(e) {
        const name = e.target.value;
        this.state.style.name = name;
        this.setState(this.state);
    }

    getColor(color) {
        if (color.alpha === 100) {
            return color.color;
        }
        else {
            return hexToRgba(color.color, color.alpha);
        }
    }
}

export const StyleBase = Form.create({ name: 'StyleBase' })(StyleBaseForm);