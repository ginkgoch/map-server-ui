import React from 'react';
import _ from 'lodash';
import * as mapJSON from '../resources/map.json';
import StyleItem from './StyleItem';
import {Menu, Icon} from 'antd';
const {SubMenu} = Menu;

export default () => {
    let styles = layer => {
        return layer.styles.map(s => (
            <Menu.Item key={s.id}>
                <StyleItem key={s.id} style={s}></StyleItem>
            </Menu.Item>));
    };

    let layers = _.flatMap(mapJSON.groups.map(g => g.layers)).map(l => {
        return (
            <SubMenu key={l.id} title={<i><Icon type="star"></Icon> {l.name}</i>}>
                {
                    styles(l)
                }
            </SubMenu>
        );
    });

    return (
        <Menu mode="inline" selectable={true} 
            mode="inline" 
            inlineIndent="12"
            style={{ borderRightWidth: 0 }}>
            {layers}
        </Menu>
    );
};