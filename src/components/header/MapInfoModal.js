import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const crsCandidates = [
  { name: "EPSG:4326 (WGS84)", crs: "WGS84", default: true },
  { name: "EPSG:3857 (GOOGLE, EPSG:900913)", crs: "GOOGLE" }
];

export class MapInfoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name || "",
      description: props.description || "",
      crs: props.crs || this.defaultCrs,
      loading: false
    };
  }

  render() {
    const crsOptions = crsCandidates.map(crs => (
      <Option key={`crs-${crs.crs}`} value={crs.crs}>
        {crs.name}
      </Option>
    ));

    const passThroughProps = _.omit(this.props, ['onMapCreated']);
    return (
      <Modal title="Create New Map" {...passThroughProps} onOk={this._onMapCreated.bind(this)} confirmLoading={this.state.loading}>
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input placeholder="New  Map Name" defaultValue={this.state.name} onChange={this._onNameChanged.bind(this)} />
          </Form.Item>
          <Form.Item label="Projection (CRS)">
            <Select defaultValue={this.state.crs} onChange={this._onCrsChanged.bind(this)}>{crsOptions}</Select>
          </Form.Item>
          <Form.Item label="Description">
            <TextArea rows={3} defaultValue={this.state.description} onChange={this._onDescriptionChanged.bind(this)}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  get defaultCrs() {
    const defaultCrs = crsCandidates.find(crs => crs.default);
    return defaultCrs ? defaultCrs.crs : "WGS84";
  }

  async _onMapCreated() {
    if (!this.props.onMapCreated) return;

    try {
        this.setState({ loading: true });
        const mapModel = { name: this.state.name, description: this.state.description, crs: this._getCrs(this.state.crs) };
        await this.props.onMapCreated(mapModel);
        this._reset();
    }
    catch (err) {
        this._showErrorMessage(err);
    }
    finally {
        this.setState({ loading: false });
    }
  }

  _onNameChanged(e) {
    this.setState({name: e.target.value});
  }

  _onDescriptionChanged(e) {
    this.setState({description: e.target.value});
  }

  _onCrsChanged(e) {
    this.setState({crs: e});
  }

  _getCrs(crs) {
    switch (crs) {
      case 'WGS84':
        return { projection: crs, unit: 'degrees' };
      default:
        return { projection: crs, unit: 'm' };
    }
  }

  _reset() {
      this.setState({
          name: '',
          description: '',
          crs: this.defaultCrs
      });
  }

  _showErrorMessage(err) {
    Modal.error({ title: 'Create Map Failed', content: 'Create map failed. ' + err  });
  }
}