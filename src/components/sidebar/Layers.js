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
                    <SubMenu key={layer.id} title={<span><LayerPreview layer={layer}></LayerPreview> {layer.name}</span>}>
                    {
                        layer.styles.map(s => { 
                            switch(s.type) {
                                case 'class-break-style':
                                    return this.renderClassBreakStyle(s);
                                default:
                                    return this.renderGeneralStyle(s); 
                            }
                        })
                    }
                    </SubMenu>
                ))}
            </Menu>
        );
    }

    renderGeneralStyle(s) {
        return (
            <Menu.Item key={s.id}>
                <Style style={s}></Style>
            </Menu.Item>
        );
    }

    renderClassBreakStyle(s) {
        return (
            <SubMenu key={s.id} title={ <Style style={s}></Style> }>
                {
                    s.classBreaks.map(cb => {
                        return (
                            <Menu.Item key={cb.style.id} style={{height: "30px", lineHeight: "30px"}}>
                                <Style style={cb.style}></Style>
                            </Menu.Item>
                        );
                    })
                }
            </SubMenu>
        );
    }
};

