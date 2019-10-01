import React from 'react';
import { StyleBaseForm } from './StyleBase';
import { List, Form, Icon, Button, Divider, Menu, Dropdown, Modal, Input, Select } from "antd";
import { StylePreview, ModalUtils } from '../shared';
import { StyleUtils, ValueItems } from '.'
import { StyleTemplates } from '../../templates';
import { MapsService } from "../../services";

class ValueStyleForm extends StyleBaseForm {
    constructor(props) {
        super(props);

        this.state = Object.assign(this.state, {
            fields: [],
            layerID: props.layerID,
            groupID: props.groupID,
            mapID: props.mapID,
            selectedField: undefined,
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
        this.state.hidePreview = true;

        const fieldOptions = this.state.fields.map(field => (
            <Select.Option key={field} value={field}>{field}</Select.Option>
        ));
        return <>
            <Form.Item label="Field">
                <Select placeholder="Select field"
                    value={this.state.selectedField}
                    onChange={e => this.onFieldChanged(e)}>
                    { fieldOptions }
                </Select>
            </Form.Item>
            <Form.Item labelCol={{ xs: { span: 0 } }} wrapperCol={{ xs: { span: 16, offset: 4 } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Value Items</h4> {this.mainActions()}
                </div>
                <Divider style={{ margin: "12px 0 12px 0" }} />
                <List size="small" itemLayout="horizontal" dataSource={this.data()} renderItem={style => (
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

    onFieldChanged(e) {
        this.state.style.field = e;
        this.setState({ style: this.state.style, selectedField: e });
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

    mainActions() {
        const btnProps = { shape: "circle", size: "small", style: { marginLeft: 4 } };
        return <div>
            <Button {...btnProps} onClick={e => this.openAutoValueItemsModal(e)}>
                <Icon type="android" />
            </Button>
            <Dropdown overlay={this.newStyleOptions()} trigger={["click"]}>
                <Button {...btnProps}><Icon type="plus" /></Button>
            </Dropdown>
            <Button {...btnProps} onClick={this.clean.bind(this)} disabled={this.state.style.items.length === 0}>
                <Icon type="delete" />
            </Button>
        </div>
    }

    newStyleOptions() {
        return (
            <Menu>{
                StyleUtils.simpleStyleTypes().map(type => (
                    <Menu.Item key={type}
                        disabled={!StyleUtils.isStyleAvailableForGeomType(type, this.props.geomType)}
                        onClick={this.newValueItem(type)}>
                        {StyleUtils.styleTypeName(type)}
                    </Menu.Item>
                ))
            }
            </Menu>
        );
    }

    newValueItem(type) {
        const newStyle = StyleUtils.defaultStyle(type);
        const newItem = StyleTemplates.getValueItem('', newStyle);

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

    openAutoValueItemsModal(e) {
        e.stopPropagation();

        const valueItems = [];
        Modal.confirm({
            title: 'Value Items Generator',
            width: 540,
            content: <ValueItems layerID={this.props.layerID}
                groupID={this.props.groupID}
                mapID={this.props.mapID}
                fields={this.state.fields}
                selectedField={this.state.selectedField}
                geomType={this.props.geomType}
                valueItems={valueItems} />,
            onOk: () => {
                this.state.style.items.length = 0;
                this.state.style.items.push(...valueItems);
                this.setState(this.state);
            }
        });
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

export const ValueStyle = Form.create({ name: 'ValueStyle' })(ValueStyleForm);