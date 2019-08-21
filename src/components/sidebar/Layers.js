import _ from 'lodash';
import React from 'react';
import {Menu} from 'antd';
import {Style} from '.';
import {LayerPreview} from '../shared/LayerPreview';
const {SubMenu} = Menu;


export class Layers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {layers: props.layers}
    }

    render () {
        return (
            <Menu mode="inline" selectable={true} 
                mode="inline" 
                inlineIndent="12"
                style={{ borderRightWidth: 0 }}>
                {this.state.layers.map(layer => (
                    <SubMenu key={layer.id} title={<i><LayerPreview layer={layer}></LayerPreview> {layer.name}</i>}>
                    {
                        layer.styles.map(s => (
                            <Menu.Item key={s.id}>
                                <Style style={s}></Style>
                            </Menu.Item>
                        ))
                    }
                    </SubMenu>
                ))}
            </Menu>
        );
    }
};