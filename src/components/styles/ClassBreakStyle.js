import React from 'react';
import { StyleBase } from './StyleBase';
import { List, Form, Icon, Button, Divider } from "antd";
import { StylePreview, ModalUtils } from '../shared';

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
            <Button {...btnProps}><Icon type="plus" /></Button>
            <Button {...btnProps} style={{ marginLeft: 4 }} onClick={this.clean.bind(this)} disabled={ this.state.style.classBreaks.length === 0 }>
                <Icon type="delete" />
            </Button>
        </div>
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
}
