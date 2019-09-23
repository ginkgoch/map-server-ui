import React, { Component } from 'react';
import { Form, Select, Button, List, Icon } from 'antd';
import ColorPicker from "rc-color-picker";

const { Item } = Form;
export class ValueItems extends Component {
    render() {
        const formItemProps = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };

        return (
            <Form layout="horizontal">
                <Item label="Field" {...formItemProps}>
                    <Select placeholder="Select field"></Select>
                </Item>
                <Item label="Start Color" {...formItemProps}>
                    <ColorPicker defaultColor="#ff0000" className="color-picker" />
                </Item>
                <Item label="End Color" {...formItemProps}>
                    <ColorPicker defaultColor="#0000ff" className="color-picker" />
                </Item>
                <Item wrapperCol={{span: 12, offset: 8}}>
                    <Button type="primary">Generate Value Items</Button>
                </Item>
                <Item wrapperCol={{span: 12, offset: 8}}>
                    <List dataSource={['Item 1', 'Item 2']}
                        size="small"
                        bordered={true} 
                        itemLayout="horizontal"
                        renderItem={item => (
                        <List.Item actions={[
                            <div style={{backgroundColor: 'red', width: 16, height: 16, display: 'inline-block', borderRadius: 8, marginRight: 6}}></div>,
                            <Icon type="close-circle" />
                            ]}>
                            <span style={{lineHeight: "14px", verticalAlign: "text-top"}}>{item}</span>
                        </List.Item>)} />
                </Item>
            </Form>
        )
    }
}