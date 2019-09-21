import React, { Component } from 'react';
import { Spin, Button, Icon, Tooltip } from "antd";

export const SideBarHeader = props => {
  return (
    <div className="sidebar-title">
      <span>Resources</span>
      <span>
        <Spin size="small" spinning={props.loading} style={{ paddingRight: 6 }}></Spin>
        <Tooltip title="Add new layer">
          <Button shape="circle" size="small" onClick={props.onAddLayerClick}>
            <Icon type="plus" />
          </Button>
        </Tooltip>
      </span>
    </div>
  );
};