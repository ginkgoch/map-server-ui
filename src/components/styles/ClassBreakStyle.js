import React from 'react';
import { StyleBaseForm } from './StyleBase';
import { List, Form, Icon, Button, Divider, Menu, Dropdown, InputNumber, Modal, Input } from "antd";
import { StylePreview, ModalUtils } from '../shared';
import { StyleUtils } from '.'

class ClassBreakStyleForm extends StyleBaseForm {
    renderContent() {
        this.state.hidePreview = true;

        return <>
            <Form.Item label="Field">
                <Input defaultValue={this.state.style.field} onChange={this.updateField.bind(this)}></Input>
            </Form.Item>
            <Form.Item labelCol={{ xs: { span: 0 } }} wrapperCol={{ xs: { span: 16, offset: 4 } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Class Break Items</h4> {this.mainActions()}
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
        const classBreaks = this.state.style.classBreaks;
        return classBreaks.map(cb => cb.style);
    }

    actions(key) {
        return [
            <Button key="edit" shape="circle" size="small" onClick={this.editClassBreak(key)}><Icon type="edit" /></Button>,
            <Button key="remove" shape="circle" size="small" style={{ marginLeft: 4 }} onClick={this.removeClassBreak.bind(this, key)}><Icon type="close" /></Button>
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
            <Button {...btnProps} style={{ marginLeft: 4 }} onClick={this.clean.bind(this)} disabled={this.state.style.classBreaks.length === 0}>
                <Icon type="delete" />
            </Button>
        </div>
    }

    newStyleOptions() {
        return (
            <Menu>
                {
                    StyleUtils.simpleStyleTypes().map(type => (
                        <Menu.Item key={type} onClick={this.newClassBreak(type)}>{StyleUtils.styleTypeName(type)}</Menu.Item>
                    ))
                }
            </Menu>
        );
    }

    newClassBreak(type) {
        const newStyle = StyleUtils.defaultStyle(type);
        const newClassBreak = {
            "minimum": 0,
            "maximum": 100,
            "style": newStyle
        };

        return this._showClassBreakModal(newClassBreak, cb => {
            this.state.style.classBreaks.push(cb);
            this.setState(this.state);
        }, 'New Class Break');
    }

    editClassBreak(key) {
        const classBreak = this.state.style.classBreaks.find(cb => cb.style.id === key);
        return this._showClassBreakModal(classBreak, cb => {
            this.setState(this.state);
        }, 'Edit Class Break');
    }

    _showClassBreakModal(classBreak, okHandler, title) {
        return () => {
            Modal.confirm({
                title: title + ' - ' + StyleUtils.styleTypeName(classBreak.style.type),
                width: 480,
                content: (
                    <Form layout="horizontal" labelCol={{ xs: { span: 6 } }} wrapperCol={{ xs: { span: 16 } }} style={{ marginTop: 40 }}>
                        <Form.Item label="Range">
                            <InputNumber min={0} defaultValue={classBreak.minimum} onChange={v => classBreak.minimum = v} />
                            <span style={{ padding: 4 }}>~</span>
                            <InputNumber min={0} defaultValue={classBreak.maximum} onChange={v => classBreak.maximum = v} />
                        </Form.Item>
                        {
                            StyleUtils.configureItems(classBreak.style)
                        }
                    </Form>
                ),
                onOk: () => {
                    classBreak.style.name = `${classBreak.minimum} ~ ${classBreak.maximum}`;
                    okHandler && okHandler(classBreak);
                }
            });
        };
    }

    clean() {
        ModalUtils.promptModal('Are you sure to clean all the class break items?', () => {
            this.state.style.classBreaks.length = 0;
            this.setState(this.state);
        })
    }

    removeClassBreak(key) {
        const index = this.state.style.classBreaks.findIndex(cb => cb.style.id === key);
        if (index < 0) {
            ModalUtils.warning('Remove Failed', 'Class Break Not Found.')
        }

        ModalUtils.promptRemoveModal('Class Break', () => {
            this.state.style.classBreaks.splice(index, 1);
            this.setState(this.state);
        });
    }
}

export const ClassBreakStyle = Form.create({name: 'ClassBreakStyle'})(ClassBreakStyleForm);
