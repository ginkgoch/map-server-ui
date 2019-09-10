import React from 'react';
import { StyleBaseForm } from './StyleBase';
import { List, Form, Icon, Button, Divider, Menu, Dropdown, Modal, Input } from "antd";
import { StylePreview, ModalUtils } from '../shared';
import { StyleUtils } from '.'

class ValueStyleForm extends StyleBaseForm {
    renderContent() {
        this.state.hidePreview = true;

        return <>
            <Form.Item label="Field">
                <Input defaultValue={this.state.style.field} onChange={this.updateField.bind(this)}></Input>
            </Form.Item>
            <Form.Item labelCol={{ xs: { span: 0 } }} wrapperCol={{ xs: { span: 16, offset: 4 } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Value Items</h4> {this.mainActions()}
                </div>
                <Divider style={{ margin: "12px 0 12px 0" }} />
                <List itemLayout="horizontal" dataSource={this.data()} renderItem={style => (
                    <List.Item key={style.id}>
                        <List.Item.Meta title={style.name}
                            avatar={<StylePreview style={style}></StylePreview>}
                        />
                        <div>
                            {this.actions(style.id)}
                        </div>
                    </List.Item>
                )}>
                </List>
            </Form.Item>
        </>
    }

    data() {
        const valueItems = this.state.style.items;
        return valueItems.map(vi => vi.style);
    }

    actions(key) {
        return [
            <Button key="edit" shape="circle" size="small" onClick={this.editValueItem(key)}><Icon type="edit" /></Button>,
            <Button key="remove" shape="circle" size="small" style={{ marginLeft: 4 }} onClick={this.removeValueItem.bind(this, key)}><Icon type="close" /></Button>
        ];
    }

    updateField(e) {
        this.state.style.field = e.target.value;
        this.setState(this.state);
    }

    mainActions() {
        const btnProps = { shape: "circle", size: "small" };
        return <div>
            <Dropdown overlay={this.newStyleOptions()} trigger={["click"]}>
                <Button {...btnProps}><Icon type="plus" /></Button>
            </Dropdown>
            <Button {...btnProps} style={{ marginLeft: 4 }} onClick={this.clean.bind(this)} disabled={this.state.style.items.length === 0}>
                <Icon type="delete" />
            </Button>
        </div>
    }

    newStyleOptions() {
        return (
            <Menu>
                {
                    StyleUtils.simpleStyleTypes().map(type => (
                        <Menu.Item key={type} onClick={this.newValueItem(type)}>{StyleUtils.styleTypeName(type)}</Menu.Item>
                    ))
                }
            </Menu>
        );
    }

    newValueItem(type) {
        const newStyle = StyleUtils.defaultStyle(type);
        const newItem = {
            "value": "",
            "style": newStyle
        };

        return this._showValueItemModal(newItem, cb => {
            this.state.style.items.push(cb);
            this.setState(this.state);
        }, 'New Value Item');
    }

    editValueItem(key) {
        const valueItem = this.state.style.items.find(vi => vi.style.id === key);
        return this._showValueItemModal(valueItem, () => {
            this.setState(this.state);
        }, 'Edit Class Break');
    }

    _showValueItemModal(valueItem, okHandler, title) {
        return () => {
            Modal.confirm({
                title: title + ' - ' + StyleUtils.styleTypeName(valueItem.style.type),
                width: 480,
                content: (
                    <Form layout="horizontal" labelCol={{ xs: { span: 6 } }} wrapperCol={{ xs: { span: 16 } }} style={{ marginTop: 40 }}>
                        <Form.Item label="Value">
                            <Input defaultValue={valueItem.value} onChange={e => valueItem.value = e.target.value} />
                        </Form.Item>
                        {
                            StyleUtils.configureItems(valueItem.style)
                        }
                    </Form>
                ),
                onOk: () => {
                    valueItem.style.name = valueItem.value;
                    okHandler && okHandler(valueItem);
                }
            });
        };
    }

    clean() {
        ModalUtils.promptModal('Are you sure to clean all the value items?', () => {
            this.state.style.items.length = 0;
            this.setState(this.state);
        })
    }

    removeValueItem(key) {
        const index = this.state.style.items.findIndex(vi => vi.style.id === key);
        if (index < 0) {
            ModalUtils.warning('Remove Failed', 'Value Item Not Found.')
        }

        ModalUtils.promptRemoveModal('Value Item', () => {
            this.state.style.items.splice(index, 1);
            this.setState(this.state);
        });
    }
}

export const ValueStyle = Form.create({name: 'ValueStyle'})(ValueStyleForm);