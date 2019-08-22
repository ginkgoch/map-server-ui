import _ from 'lodash';
import React from 'react';
import {Menu} from 'antd';
import {Style, Layer} from '.';

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
                    <Layer key={layer.id} layer={layer}></Layer>
                ))}
            </Menu>
        );
    }
};

