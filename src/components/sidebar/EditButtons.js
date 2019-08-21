import React from 'react';
import {Button, Icon} from 'antd';

export class EditButtons extends React.Component {
    render() {
        const iconStyle = {
            marginRight: 0
        };

        const btnStyle = {
            marginLeft: 4
        }

        const btns = [{
            type: 'edit',
            click: this.props.onEditButtonClick
        }, {
            type: 'close',
            click: this.props.onCloseButtonClick
        }].map(btn => (
            <Button key={btn.type} shape="circle" size="small" style={btnStyle} onClick={btn.click}>
                <Icon type={btn.type} size="small" style={iconStyle}></Icon>
            </Button>
        ));

        return (
            <React.Fragment>
                {btns}
            </React.Fragment>
        );
    }
}