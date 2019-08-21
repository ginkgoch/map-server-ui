import React from "react";
import { Collapse, Button, Icon } from "antd";
import {Style} from '.';
import { LayerPreview } from "../shared/LayerPreview";

const {Panel} = Collapse;
export class Layer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {layer: props.layer};
    }

    render() {
        const layer = this.state.layer;

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
        <Collapse bordered={false} expandIconPosition="right">
            <Panel header={<span><LayerPreview layer={layer}></LayerPreview> {layer.name}</span>}
                extra={btns}>
                <ul style={{listStyleType: "none", lineHeight: "38px", paddingLeft: "10px"}}>
                    {
                        layer.styles.map(s => (
                            <li key={s.id}>
                                <Style key={s.id} style={s}></Style>
                            </li>
                        ))
                    }
                </ul>
            </Panel>
        </Collapse>
        )
    }
}



