import React from "react";
import {Avatar} from 'antd';

export default () => {
    return (
        <h1 style={{display: "inline-block"}}>
            <Avatar size="large" icon="user"></Avatar>
            <span style={{ "marginLeft": "14px" }}>Ginkgoch</span>
        </h1>
    );
}