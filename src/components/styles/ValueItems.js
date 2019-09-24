import React, { Component } from "react";
import { Form, Select, Button, List, Icon, InputNumber } from "antd";
import ColorPicker from "rc-color-picker";
import { MapsService } from "../../services";
import { randomColor, normalizeRCColor } from "../../shared";
import { hexColorWithAlpha } from "./KnownColors";
import { UtilitiesService } from "../../services/UtilitiesService";

const { Item } = Form;
export class ValueItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layerID: props.layerID,
      groupID: props.groupID,
      mapID: props.mapID,
      fields: [],
      layerIDUpdated: false,
      selectedField: undefined,
      fillColor1: randomColor(),
      fillColor2: randomColor(),
      strokeColor1: randomColor(),
      strokeColor2: randomColor(),
      strokeWidth: 1,
      valueItems: [],
      loading: false
    };
  }

  async componentDidMount() {
    this.setState({ layerIDUpdated: true });
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (
      nextProps.layerID !== preState.layerID ||
      nextProps.groupID !== preState.groupID ||
      nextProps.mapID !== preState.mapID
    ) {
      return {
        ...this.state,
        fields: [],
        selectedField: undefined,
        layerIDUpdated: true,
        layerID: nextProps.layerID,
        groupID: nextProps.groupID,
        mapID: nextProps.mapID
      };
    } else {
      return null;
    }
  }

  async componentDidUpdate() {
    if (this.state.layerIDUpdated) {
      await this.reloadFields();
    }
  }

  render() {
    const fillColor1WithAlpha = hexColorWithAlpha(this.state.fillColor1);
    const fillColor2WithAlpha = hexColorWithAlpha(this.state.fillColor2);
    const strokeColor1WithAlpha = hexColorWithAlpha(this.state.strokeColor1);
    const strokeColor2WithAlpha = hexColorWithAlpha(this.state.strokeColor2);

    const formItemProps = {
      labelCol: { xs: { span: 6 } },
      wrapperCol: { xs: { span: 16 } }
    };

    return (
      <Form layout="horizontal">
        <Item label="Field" {...formItemProps}>
          <Select
            placeholder="Select field"
            value={this.state.selectedField}
            onChange={e => this.setState({ selectedField: e })}
          >
            {this.state.fields.map(f => (
              <Select.Option key={f} value={f}>
                {f}
              </Select.Option>
            ))}
          </Select>
        </Item>
        <Item label="Fill Color" {...formItemProps}>
          <ColorPicker
            className="color-picker-sm"
            defaultColor={fillColor1WithAlpha.hex}
            defaultAlpha={fillColor1WithAlpha.alpha}
            onChange={newColor => this.setColor(newColor, "fillColor1")}
          />
          <span className="color-picker-space">To:</span>
          <ColorPicker
            className="color-picker-sm"
            defaultColor={fillColor2WithAlpha.hex}
            defaultAlpha={fillColor2WithAlpha.alpha}
            onChange={newColor => this.setColor(newColor, "fillColor2")}
          />
        </Item>
        <Item label="Stroke Color" {...formItemProps}>
          <ColorPicker
            className="color-picker-sm"
            defaultColor={strokeColor1WithAlpha.hex}
            defaultAlpha={strokeColor1WithAlpha.alpha}
            onChange={newColor => this.setColor(newColor, "strokeColor1")}
          />
          <span className="color-picker-space">To:</span>
          <ColorPicker
            className="color-picker-sm"
            defaultColor={strokeColor2WithAlpha.hex}
            defaultAlpha={strokeColor2WithAlpha.alpha}
            onChange={newColor => this.setColor(newColor, "strokeColor2")}
          />
        </Item>
        <Item label="Stroke Width" {...formItemProps}>
            <InputNumber defaultValue={this.state.strokeWidth} min={0} onChange={v => this.setState({ strokeWidth: v })} />
        </Item>
        <Item wrapperCol={{ sm: { span: 16, offset: 6 }, xs: { span: 24 } }}>
          <Button
            type="primary"
            onClick={async () => await this.generateValueItems()}
          >
            Generate Value Items
          </Button>
        </Item>
        <Item wrapperCol={{ sm: { span: 16, offset: 6 }, xs: { span: 24 } }}>
          <List
            header={`Value Items (${this.state.valueItems.length})`}
            dataSource={this.state.valueItems}
            size="small"
            bordered={true}
            itemLayout="horizontal"
            loading={this.state.loading}
            style={{ height: 400, overflow: "auto" }}
            renderItem={item => (
              <List.Item
                actions={[
                  <div
                    style={{
                      backgroundColor: item[1],
                      border: `solid ${this.state.strokeWidth}px ${item[2]}`,
                      width: 60,
                      height: 28,
                      display: "inline-block",
                      borderRadius: 8,
                      marginRight: 6
                    }}
                  ></div>
                ]}
              >
                {item[0]}
              </List.Item>
            )}
          />
        </Item>
      </Form>
    );
  }

  async reloadFields() {
    const response = await MapsService.getFields(
      this.state.layerID,
      this.state.groupID,
      this.state.mapID,
      {
        fields: ["name", "type"]
      }
    );
    if (response.status === 200) {
      const fields = response.data.map(f => f.name);
      let selectedField = fields.length > 0 ? fields[0] : undefined;
      this.setState({ fields, selectedField, layerIDUpdated: false });
    } else {
      console.error(response.data);
      this.setState({
        fields: [],
        selectedField: undefined,
        layerIDUpdated: false
      });
    }
  }

  setColor(newRCColor, colorKey) {
    const newColor = normalizeRCColor(newRCColor.color, newRCColor.alpha);
    this.setState({ [colorKey]: newColor });
  }

  async generateValueItems() {
    if (this.state.selectedField === undefined) {
      return;
    }

    this.setState({ loading: true });

    try {
      const response = await MapsService.getPropertyByField(
        this.state.selectedField,
        this.state.layerID,
        this.state.groupID,
        this.state.mapID,
        ["distinct"]
      );

      let distinctFields = undefined;
      if (
        response.status === 200 &&
        (distinctFields = response.data.find(f => f.distinct))
      ) {
        const fillColors = await UtilitiesService.getBreakDownColors(this.state.fillColor1, this.state.fillColor2, distinctFields.distinct.length);
        let strokeColors = [];
        if (this.state.strokeWidth > 0) {
            strokeColors = await UtilitiesService.getBreakDownColors(this.state.strokeColor1, this.state.strokeColor2, distinctFields.distinct.length);
        }

        const newValueItems = _.zip(distinctFields.distinct, fillColors.data, strokeColors.data);
        this.setState({ valueItems: newValueItems });
      } else {
        this.setState({ valueItems: [] });
      }
    } finally {
      this.setState({ loading: false });
    }
  }
}