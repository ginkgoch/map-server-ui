import React from 'react';
import { Select, Divider } from "antd";


export const DataTableTitle = props => {
    const options = props.columns.map(col => (
        <Select.Option key={col.title} value={col.title}>{col.title}</Select.Option>
    ));
    return (
        <Fragment>
            <span>Records: ${props.properties.length} <Divider type="vertical" /> Columns: ${props.columns.length}</span>
            <Divider type="vertical" />
            <Select mode="multiple" style={{width: 400}} placeholder="Select to filter visible columns">
                {options}
            </Select>
        </Fragment>
    );
};