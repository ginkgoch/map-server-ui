import React from 'react';
import {Icon, Button, Menu} from 'antd';
import StylePreview from '../shared/StylePreview';

const {SubMenu} = Menu;

export class Style extends React.Component {
    constructor(props) {
        super(props);

        this.state = {style: props.style};
    }

    render() {
        const style = this.state.style;
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

        return this._renderGeneral(style, btns);
    }

    _renderGeneral(style, btns) {
        return (
            <div>
                <StylePreview style={ style }></StylePreview>
                <span className="style-label">{style.name}</span>
                <div style={{float: "right"}}>
                    {btns}
                </div>
            </div>
        );
    }
}