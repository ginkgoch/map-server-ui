import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
import _ from 'lodash';

const crsCandidates = [
  { name: "EPSG:4326 (WGS84)", crs: "WGS84", unit: "degrees", default: true },
  { name: "EPSG:3857 (GOOGLE, EPSG:900913)", unit: "m", crs: "GOOGLE" }
];

const { Option } = Select;
const { TextArea } = Input;
const MapInfoModalForm = Form.create({ name: "MapInfoModalForm" })(
  class extends Component {
    constructor(props) {
      super(props);

      this.state = { mapModel: props.mapModel, title: props.title };
    }

    static getDerivedStateFromProps(nextProps, preState) {
      if (preState.title !== nextProps.title || preState.mapModel !== nextProps.mapModel) {
        return {...preState, title: nextProps.title, mapModel: nextProps.mapModel};
      }
      else {
        return null;
      }
    }

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      const crsOptions = crsCandidates.map(crs => (
        <Option key={`crs-${crs.crs}`} value={crs.crs}>
          {crs.name}
        </Option>
      ));

      const passThroughProps = _.omit(this.props, ["onConfirm"]);
      const { onConfirm, loading } = this.props;
      const title = this.state.title || 'Create New Map'

      return (
        <Modal
          title={title}
          {...passThroughProps}
          onOk={onConfirm}
          confirmLoading={loading}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "Please input map name" }],
                initialValue: (this.state.mapModel ? this.state.mapModel.name : '')
              })(<Input placeholder="New  Map Name" />)}
            </Form.Item>
            <Form.Item label="Projection (CRS)">
              {getFieldDecorator("crs", {
                initialValue: (this.state.mapModel ? this.state.mapModel.content.srs.projection : crsCandidates[0].crs)
              })(<Select>{crsOptions}</Select>)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description", {
                initialValue: (this.state.mapModel ? this.state.mapModel.description : '')
              })(<TextArea rows={3} />)}
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
    const passThroughProps = _.omit(this.props, ["onConfirm"]);
    return (
      <MapInfoModalForm
        wrappedComponentRef={this._saveFormRef.bind(this)}
        onConfirm={async e => await this.onConfirm(e)}
        loading={this.state.loading}
        {...passThroughProps}
      />
    );
  }

  async onConfirm(e) {
    e.preventDefault();
    if (!this.props.onConfirm) return;

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

      if (this.props.mapModel) {
        const editingMapModel = _.cloneDeep(this.props.mapModel);
        editingMapModel.name = mapModel.name;
        editingMapModel.description = mapModel.description;
        editingMapModel.content.srs = mapModel.crs;
        await this.props.onConfirm(editingMapModel, true);
      }
      else {
        await this.props.onConfirm(mapModel);
      }
      this.formRef.props.form.resetFields();
    } catch (err) {
      this.showErrorMessage(err);
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

  showErrorMessage(err) {
    Modal.error({
      title: "Failed",
      content: err.toString()
    });
  }
}