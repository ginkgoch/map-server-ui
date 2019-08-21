import React from "react";
import { Menu, Icon } from "antd";
import {Style} from '.';
import { LayerPreview } from "../shared/LayerPreview";

const {SubMenu} = Menu;
export let Layer = (layer, key) => {
    return (
        <SubMenu key={key} title={<i><LayerPreview layer={layer}></LayerPreview> {layer.name}</i>}>
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

