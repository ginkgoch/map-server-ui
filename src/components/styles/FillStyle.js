import 'rc-color-picker/assets/index.css';
import React, { Component } from 'react';
import { Form, Input, Button } from "antd";
import ColorPicker from "rc-color-picker";

export class FillStyle extends Component {
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
                    <Input placeholder="Name"></Input>
                </Form.Item>
                <Form.Item label="Fill">
                    <ColorPicker color={'#36c'} style={{Width: "100%"}}></ColorPicker>
                </Form.Item>
                <Form.Item label="Stroke">
                    <Input placeholder="Stroke"></Input>
                </Form.Item>
                <Form.Item label="Stroke Width">
                    <Input placeholder="Stroke Width"></Input>
                </Form.Item>
                <Form.Item wrapperCol={{span: 12, offset:8}}>
                    <Button style={{marginRight: 8}}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}