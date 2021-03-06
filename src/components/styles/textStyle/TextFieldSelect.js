import React, { Component } from 'react';
import { Input, Dropdown, Menu, Icon } from 'antd';

export class TextFieldSelect extends Component {
    constructor(props) {
        super(props);

        this.state = { content: props.content || '' };
    }

    render() {
        const dropdownMenu = <Menu onClick={e => this.onFieldMenuClick(e)}>{
            this.props.fields.map(f => (
                <Menu.Item key={f}>{f}</Menu.Item>
            ))}
        </Menu>

        const addonDropdown = <Dropdown overlay={dropdownMenu} trigger="click" placement="bottomRight">
            <Icon type="down" />
        </Dropdown>;

        return <>
            <Input placeholder="Text field e.g. [FIELD_NAME]"
                defaultValue={this.state.content}
                value={this.state.content}
                onChange={e => this.onContentChange(e)}
                addonAfter={addonDropdown} />
        </>
    }

    onFieldMenuClick(e) {
        const newState = { content: this.state.content + `[${e.key}]` };
        this.setState(newState);
        this.props.onContentChange && this.props.onContentChange(newState.content);
    }

    onContentChange(e) {
        const newState = { content: e.target.value };
        this.setState(newState);
        this.props.onContentChange && this.props.onContentChange(newState.content);
    }
};