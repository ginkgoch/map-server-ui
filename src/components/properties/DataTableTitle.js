import React, { Fragment } from 'react';
import { Select, Divider } from "antd";
import { ColumnFilter } from '.';

export const DataTableTitle = props => {
    const options = props.columns.map(col => (
        <Select.Option key={col.title} value={col.title}>{col.title}</Select.Option>
    ));
    return (
        <Fragment>
            <span>Records: {props.properties.length} <Divider type="vertical" /> Columns: {props.columns.length}</span>
            <Divider type="vertical" />
            <ColumnFilter columns={props.columns.map(p => p.title)} style={{width: 200}} onConfirm={columns => props.onFilterConfirm(columns)} />
        </Fragment>
    );
};