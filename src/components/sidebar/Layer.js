import React from "react";
import { Collapse, Button, Icon } from "antd";
import { Style, EditButtons, ClassBreaks } from '.';
import { LayerPreview } from "../shared/LayerPreview";

const {Panel} = Collapse;
export class Layer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {layer: props.layer};
    }

    render() {
        const layer = this.state.layer;

        return (
        <Collapse bordered={false} expandIconPosition="right">
            <Panel header={<span><LayerPreview layer={layer}></LayerPreview> {layer.name}</span>}
                extra={<EditButtons></EditButtons>}>
                <ul style={{listStyleType: "none", lineHeight: "38px", paddingLeft: "10px"}}>
                    {
                        layer.styles.map(s => (
                            <li key={s.id}>
                            {
                                this._renderStyle(s)
                            }
                            </li>
                        ))
                    }
                </ul>
            </Panel>
        </Collapse>
        )
    }

    _renderStyle(s) {
        if (s.type === 'class-break-style') {
            return (
            <div>
                <Style style={s}></Style>
                <ClassBreaks classBreaks={s.classBreaks}></ClassBreaks>
            </div>
            );
        }
        else return (
            <Style style={s}></Style>
        );
    }
}



