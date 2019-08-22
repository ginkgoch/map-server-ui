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
            click: (e) => {
                e.stopPropagation();
                this.props.onEditButtonClick && this.props.onEditButtonClick(e);
            }
        }, {
            type: 'close',
            click: (e) => {
                e.stopPropagation();
                this.props.onCloseButtonClick && this.props.onCloseButtonClick(e);
            }
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