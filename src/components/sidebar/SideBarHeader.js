import React, { Component } from 'react';
import { Spin, Button, Icon } from "antd";

export const SideBarHeader = props => {
    return (
      <div className="sidebar-title">
        <span>Resources</span>
        <span>
          <Spin size="small" spinning={props.loading}></Spin>
          <Button shape="circle" size="small">
            <Icon type="plus" />
          </Button>
        </span>
      </div>
    );
  };