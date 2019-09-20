import React, { Component, Fragment } from "react";
import { Table, Select, Divider } from "antd";
import { MapsService } from "../../services/MapsService";
import { DataTableTitle } from './DataTableHeader';

export class DataTable extends Component {
  constructor(props) {
    super(props);

    this.layerID = props.layerID;
    this.mapID = props.mapID;
    this.groupID = props.groupID || "Default";

    this.state = { loading: false, properties: [], columns: [] };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const dataSource = await this.getDataSource();
    const columns = dataSource.fields.map(f => {
      return {
        title: f.name,
        dataIndex: f.name,
        width: 120
      };
    });

    this.setState({
      properties: dataSource.properties,
      columns,
      loading: false
    });
  }

  render() {
    const title = () => (<DataTableTitle columns={this.state.columns} properties={this.state.properties} />)
    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          dataSource={this.state.properties}
          columns={this.state.columns}
          scroll={{ x: "200%", y: 260 }}
          pagination={false}
          size="small"
          title={title}
        ></Table>
      </Fragment>
    );
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
      this.layerID,
      this.groupID,
      this.mapID,
      { fields: ["name", "type"] }
    );
    return response.data;
  }

  async getProperties() {
    const response = await MapsService.getProperties(
      this.layerID,
      this.groupID,
      this.mapID
    );
    return response.data;
  }
}

