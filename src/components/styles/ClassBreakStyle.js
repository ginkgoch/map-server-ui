import React from 'react';
import { StyleBase } from './StyleBase';
import { List, Form, Icon, Button, Divider, Menu, Dropdown, InputNumber, Modal } from "antd";
import { StylePreview, ModalUtils } from '../shared';
import { StyleUtils } from '.'

export class ClassBreakStyle extends StyleBase {
    renderContent() {
        this.state.hidePreview = true;

        return <>
            <Form.Item labelCol={{ xs: { span: 0 } }} wrapperCol={{ xs: { span: 16, offset: 4 } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Class Break Items</h4> {this.mainActions()}
                </div>
                <Divider style={{ margin: "12px 0 12px 0" }} />
                <List itemLayout="horizontal" dataSource={this.data()} renderItem={style => (
                    <List.Item key={style.id}>
                        <List.Item.Meta title={style.name}
                            avatar={this.preview(style)}
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
            <Button key="edit" shape="circle" size="small"><Icon type="edit" /></Button>,
            <Button key="remove" shape="circle" size="small" style={{ marginLeft: 4 }} onClick={this.removeClassBreak.bind(this, key)}><Icon type="close" /></Button>
        ];
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
                        <Menu.Item key={type} onClick={this.showClassBreakModal(type)}>{StyleUtils.styleTypeName(type)}</Menu.Item>
                    ))
                }
            </Menu>
        );
    }

    showClassBreakModal(type) {
        const configuringStyle = this.getDefaultStyle(type);
        const configuringClassBreak = {
            "minimum": 0,
            "maximum": 100,
            "style": configuringStyle
        };
        return () => {
            Modal.confirm({
                title: 'New Class Break - ' + StyleUtils.styleTypeName(type),
                width: 480,
                content: (
                    <Form layout="horizontal" labelCol={{ xs: { span: 6 } }} wrapperCol={{ xs: { span: 16 } }} style={{ marginTop: 40 }}>
                        <Form.Item label="Range">
                            <InputNumber min={0} defaultValue={configuringClassBreak.minimum} onChange={ v => configuringClassBreak.minimum = v } /> 
                            <span style={{padding: 4}}>~</span>
                            <InputNumber min={0} defaultValue={configuringClassBreak.maximum} onChange={ v => configuringClassBreak.maximum = v } />
                        </Form.Item>
                        {
                            this.getConfiguringFormItems(configuringClassBreak.style)
                        }
                    </Form>
                ),
                onOk: () => {
                    configuringClassBreak.style.name = `${configuringClassBreak.minimum} ~ ${configuringClassBreak.maximum}`;
                    this.state.style.classBreaks.push(configuringClassBreak);
                    this.setState(this.state);
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

    preview(style) {
        return (
            <StylePreview style={style}></StylePreview>
        );
    }

    getDefaultStyle(type) {
        return StyleUtils.defaultStyle(type);
    }

    getConfiguringFormItems(style) {
        const props = {
            onFillStyleChange: color => {
                style.fillStyle = color.color;
            },
            onStrokeStyleChange: color => {
                style.strokeStyle = color.color;
            },
            onLineWidthChange: lineWidth => {
                style.lineWidth = lineWidth;
            },
            onSymbolChanged: symbol => {
                style.symbol = symbol;
            }
        };
        return StyleUtils.configureItems(style, props);
    }
}
