import React from "react";
import { Menu, Icon } from "antd";
import {Style} from '.';

const {SubMenu} = Menu;
export let Layer = (layer, key) => {
    return (
        <SubMenu key={key} title={<i><Icon type="star"></Icon> {layer.name}</i>}>
            {
                layer.styles.map(s => (
                    <Menu.Item key={s.id}>
                        <Style key={s.id} style={s}></Style>
                    </Menu.Item>
                ))
            }
        </SubMenu>
    );
}

