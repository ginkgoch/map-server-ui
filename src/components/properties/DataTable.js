import React, { Component, Fragment } from "react";
import { Table } from "antd";
import { MapsService } from "../../services/MapsService";
import { DataTableTitle } from './DataTableTitle';

export class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = { loading: false, 
            properties: [], columns: [], visibleColumns: [], 
            layerID: props.layerID, groupID: props.groupID, mapID: props.mapID 
        };
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (nextProps.layerID !== preState.layerID || nextProps.groupID !== preState.groupID || nextProps.mapID != preState.mapID) {
            return Object.assign(preState, { layerID: nextProps.layerID, 
                groupID: nextProps.groupID, 
                mapID: nextProps.mapID,
                reload: true
            })
        }

        return null;
    }

    async componentDidMount() {
        await this.reloadDataTable();
    }

    async componentDidUpdate() {
        if (this.state.reload) {
            this.state.reload = false;
            await this.reloadDataTable();
        }
    }

    render() {
        const title = () => (<DataTableTitle columns={this.state.columns} properties={this.state.properties} onFilterConfirm={columns => this.resetVisibleColumns(columns)} />)
        return (
            <Fragment>
                <Table
                    loading={this.state.loading}
                    dataSource={this.state.properties}
                    columns={this.state.visibleColumns}
                    scroll={{ x: "200%", y: 260 }}
                    pagination={false}
                    size="small"
                    title={title}
                ></Table>
            </Fragment>
        );
    }

    async reloadDataTable() {
        if (!this.checkRequestIsReady()) {
            return;
        }

        this.setState({ loading: true });

        this.dataSource = await this.getDataSource();
        const columns = this.dataSource.fields.map(f => {
            return {
                title: f.name,
                dataIndex: f.name,
                width: 120
            };
        });

        delete columns[columns.length - 1].width;
        this.setState({
            properties: this.dataSource.properties,
            columns,
            visibleColumns: columns,
            loading: false
        });
    }

    async getDataSource() {
        return await Promise.all([this.getFields(), this.getProperties()]).then(
            values => {
                return Promise.resolve({
                    fields: values[0],
                    properties: values[1]
                });
            }
        );
    }

    async getFields() {
        const response = await MapsService.getFields(
            this.state.layerID,
            this.state.groupID,
            this.state.mapID,
            { fields: ["name", "type"] }
        );
        return response.data;
    }

    async getProperties() {
        const response = await MapsService.getProperties(
            this.state.layerID,
            this.state.groupID,
            this.state.mapID
        );
        return response.data.map((rec, i) => Object.assign(rec, { key: i }));
    }

    resetVisibleColumns(columns) {
        const visibleColumns = this.dataSource.fields.filter(f => !columns || columns.length === 0 || columns.includes(f.name)).map(f => {
            return {
                title: f.name,
                dataIndex: f.name,
                width: 120
            };
        });

        delete visibleColumns[visibleColumns.length - 1].width;
        this.setState({ visibleColumns: visibleColumns });
    }

    checkRequestIsReady() {
        return this.state.layerID !== undefined && this.state.groupID !== undefined && this.state.mapID !== undefined;
    }
}

