import 'rc-color-picker/assets/index.css';
import React, { Component } from 'react';
import { Form, Input, Button } from "antd";
import { StylePreview } from '../shared';

export class StyleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { style: props.style }
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
        return (  
            <Form layout="horizontal" {...colStyle}>
                <Form.Item label="Name">
                    <Input placeholder="Name" value={this.state.style.name} onChange={this.onNameChange.bind(this)}></Input>
                </Form.Item>
                {
                    this.renderContent()
                }

                <Form.Item wrapperCol={{span: 12, offset:8}}>
                    <StylePreview style={this.state.style} width={60} height={60}></StylePreview>
                </Form.Item>
                <Form.Item wrapperCol={{span: 12, offset:8}}>
                    <Button style={{marginRight: 8}} onClick={this.props.onEditStyleCanceled}>Cancel</Button>
                    <Button type="primary" onClick={ () => this.props.onEditStyleSubmit(this.state.style) }>Submit</Button>
                </Form.Item>
            </Form>
        );
    }

    renderContent() {
        return [];
    }

    onFillStyleChange(color) {
        this.state.style.fillStyle = color.color;
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
}