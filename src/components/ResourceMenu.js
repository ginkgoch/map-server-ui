import React from 'react';
import _ from 'lodash';
import * as mapJSON from '../resources/map.json';
import {Menu, Icon} from 'antd';
const {SubMenu} = Menu;

export default () => {
    let groups = mapJSON.groups.map((g, i) => {
        return (
            <SubMenu key={`group_${i}`} title={ g.name }></SubMenu>
        );
    });

    let layers = _.flatMap(mapJSON.groups.map(g => g.layers)).map((l, i) => {
        return (
            <Menu.Item key={i}><i><Icon type="star"></Icon> {l.name}</i></Menu.Item>
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