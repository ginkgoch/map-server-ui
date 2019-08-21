import React from 'react';
import _ from 'lodash';
import * as mapJSON from '../resources/map.json';
import {Menu} from 'antd';
import LayerItem from './LayerItem.js';

export default () => {
    let layers = _.flatMap(mapJSON.groups.map(g => g.layers)).map(l => {
        return (
            LayerItem(l, l.id)
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