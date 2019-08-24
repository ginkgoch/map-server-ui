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
                            {this.actions()}
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

    actions() {
        return [
            <Button key="edit" shape="circle" size="small"><Icon type="edit" /></Button>,
            <Button key="remove" shape="circle" size="small" style={{ marginLeft: 4 }}><Icon type="close" /></Button>
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
        const options = [
            { type: 'fill-style' },
            { type: 'line-style' },
            { type: 'point-style' }
        ];
        return (
            <Menu>
                {
                    options.map(opt => (
                        <Menu.Item key={opt.type} onClick={this.showClassBreakModal(opt.type)}>{StyleUtils.styleTypeName(opt.type)}</Menu.Item>
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
                    <Form layout="horizontal" labelCol={{ xs: { span: 6 } }} wrapperCol={{ xs: { span: 16 } }} style={{marginTop: 40}}>
                        <Form.Item label="Range">
                            <InputNumber defaultValue={configuringClassBreak.minimum} /> ~ <InputNumber defaultValue={configuringClassBreak.maximum} />
                        </Form.Item>
                        {
                            this.getConfiguringFormItems(configuringClassBreak.style)
                        }
                    </Form>
                )
            });
        };
    }

    preview(style) {
        return (
            <StylePreview style={style}></StylePreview>
        );
    }

    clean() {
        ModalUtils.promptModal('Are you sure to clean all the class break items?', () => {
            this.state.style.classBreaks.length = 0;
            this.setState(this.state);
        })
    }

    getDefaultStyle(type) {
        return StyleUtils.defaultStyle(type);
    }

    getConfiguringFormItems(style) {
        return StyleUtils.configureItems(style);
    }
}
