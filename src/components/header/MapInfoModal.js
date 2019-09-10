import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const crsCandidates = [
  { name: "EPSG:4326 (WGS84)", crs: "WGS84", default: true },
  { name: "EPSG:3857 (GOOGLE, EPSG:900913)", crs: "GOOGLE" }
];

const MapInfoModalForm = Form.create({ name: "MapInfoModalForm" })(
  class extends Component {
    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      const crsOptions = crsCandidates.map(crs => (
        <Option key={`crs-${crs.crs}`} value={crs.crs}>
          {crs.name}
        </Option>
      ));

      const passThroughProps = _.omit(this.props, ["onMapCreated"]);
      const { onMapCreated, loading } = this.props;
      return (
        <Modal
          title="Create New Map"
          {...passThroughProps}
          onOk={onMapCreated}
          confirmLoading={loading}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input map name" }],
              })(<Input placeholder="New  Map Name" />)}
            </Form.Item>
            <Form.Item label="Projection (CRS)">
              {getFieldDecorator("crs", {
                initialValue: 'WGS84'
              })(<Select>{crsOptions}</Select>)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description")(<TextArea rows={3} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

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

  _saveFormRef(formRef) {
    this.formRef = formRef;
  }

  _hasError(fieldsErr) {
    const hasErr = Object.keys(fieldsErr).some(f => fieldsErr[f]);
    return hasErr;
  }

  render() {
    const passThroughProps = _.omit(this.props, ["onMapCreated"]);
    return (
      <MapInfoModalForm
        wrappedComponentRef={this._saveFormRef.bind(this)}
        onMapCreated={this._onMapCreated.bind(this)}
        loading={this.state.loading}
        {...passThroughProps}
      />
    );
  }

  get defaultCrs() {
    const defaultCrs = crsCandidates.find(crs => crs.default);
    return defaultCrs ? defaultCrs.crs : "WGS84";
  }

  async _onMapCreated(e) {
    e.preventDefault();
    if (!this.props.onMapCreated) return;

    try {
      this.setState({ loading: true });
      // const mapModel = { name: this.state.name, description: this.state.description, crs: this._getCrs(this.state.crs) };

      const that = this;
      const mapModel = await new Promise(res => {
        that.formRef.props.form.validateFields((err, values) => {
          if (err) {
            res(null);
          }

          res({
            name: values.name,
            description: values.description,
            crs: that._getCrs(values.crs)
          });
        });
      });

      if (mapModel === null) {
        return;
      }

      await this.props.onMapCreated(mapModel);
      this._reset();
    } catch (err) {
      this._showErrorMessage(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  _onNameChanged(e) {
    this.setState({ name: e.target.value });
  }

  _onDescriptionChanged(e) {
    this.setState({ description: e.target.value });
  }

  _onCrsChanged(e) {
    this.setState({ crs: e });
  }

  _getCrs(crs) {
    switch (crs) {
      case "WGS84":
        return { projection: crs, unit: "degrees" };
      default:
        return { projection: crs, unit: "m" };
    }
  }

  _reset() {
    this.setState({
      name: "",
      description: "",
      crs: this.defaultCrs
    });
  }

  _showErrorMessage(err) {
    Modal.error({
      title: "Create Map Failed",
      content: "Create map failed. " + err
    });
  }
}