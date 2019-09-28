import React, { Fragment } from 'react';
import { Divider } from "antd";
import { ColumnFilter } from '.';

export const DataTableTitle = props => {
    return (
        <Fragment>
            <span>Layer: <b>{props.name}</b> <Divider type="vertical" /> Records: {props.properties.length} <Divider type="vertical" /> Columns: {props.columns.length}</span>
            <Divider type="vertical" />
            <ColumnFilter columns={props.columns.map(p => p.title)} style={{width: 200}} onConfirm={columns => props.onFilterConfirm(columns)} />
        </Fragment>
    );
};