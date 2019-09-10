import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";

const crsCandidates = [
  { name: "EPSG:4326 (WGS84)", crs: "WGS84", unit: "degrees", default: true },
  { name: "EPSG:3857 (GOOGLE, EPSG:900913)", unit: "m", crs: "GOOGLE" }
];

const { Option } = Select;
const { TextArea } = Input;
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
                initialValue: crsCandidates[0].crs
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
      crs: props.crs || crsCandidates[0].crs,
      loading: false
    };
  }

  _saveFormRef(formRef) {
    this.formRef = formRef;
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

  async _onMapCreated(e) {
    e.preventDefault();
    if (!this.props.onMapCreated) return;

    try {
      this.setState({ loading: true });

      const that = this;
      const mapModel = await new Promise(res => {
        that.formRef.props.form.validateFields((err, values) => {
          if (err) {
            res(null);
          }

          res({
            name: values.name,
            description: values.description,
            crs: that.parseCrs(values.crs)
          });
        });
      });

      if (mapModel === null) {
        return;
      }

      await this.props.onMapCreated(mapModel);
      this.formRef.props.form.resetFields();
    } catch (err) {
      this._showErrorMessage(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  parseCrs(crsID) {
    const crs = crsCandidates.find(c => c.crs === crsID);
    if (crs === undefined) {
      crs = crsCandidates[0];
    }
    
    return { projection: crs.crs, unit: crs.unit };
  }

  _showErrorMessage(err) {
    Modal.error({
      title: "Create Map Failed",
      content: "Create map failed. " + err
    });
  }
}