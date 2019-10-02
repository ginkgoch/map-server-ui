import React, { Component } from "react";
import { Form, Select, Button, List, InputNumber } from "antd";
import ColorPicker from "rc-color-picker";
import { MapsService } from "../../services";
import { randomColor, normalizeRCColor } from "../../shared";
import { hexColorWithAlpha } from "./KnownColors";
import { UtilitiesService } from "../../services/UtilitiesService";
import { StyleTemplates } from "../../templates";
import { GeomUtils } from "../shared/GeomUtils";
import { SimplePreview } from "../shared";

const { Item } = Form;
export class ClassBreaks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layerID: props.layerID,
      groupID: props.groupID,
      mapID: props.mapID,
      fields: props.fields,
      selectedField: props.selectedField,
      fillColor1: randomColor(),
      fillColor2: randomColor(),
      strokeColor1: randomColor(),
      strokeColor2: randomColor(),
      strokeWidth: 1,
      classBreaksCount: 6,
      classBreaks: [],
      loading: false
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (
      nextProps.layerID !== preState.layerID ||
      nextProps.groupID !== preState.groupID ||
      nextProps.mapID !== preState.mapID ||
      nextProps.fields !== preState.fields ||
      nextProps.selectedField !== preState.selectedField
    ) {
      return {
        ...this.state,
        fields: nextProps.fields,
        selectedField: nextProps.selectedField,
        layerID: nextProps.layerID,
        groupID: nextProps.groupID,
        mapID: nextProps.mapID
      };
    } else {
      return null;
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
            disabled
          >
            {this.state.fields.map(f => (
              <Select.Option key={f} value={f}>
                {f}
              </Select.Option>
            ))}
          </Select>
        </Item>
        <Item label="Break Count" {...formItemProps}>
          <InputNumber defaultValue={this.state.classBreaksCount}
            onChange={e => this.onClassBreakCountChange(e)}></InputNumber>
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
            onClick={async () => await this.generateClassBreaks()}
          >
            Generate Value Items
          </Button>
        </Item>
        <Item wrapperCol={{ sm: { span: 16, offset: 6 }, xs: { span: 24 } }}>
          <List
            header={`Value Items (${this.state.classBreaks.length})`}
            dataSource={this.state.classBreaks}
            size="small"
            bordered={true}
            itemLayout="horizontal"
            loading={this.state.loading}
            style={{ height: 280, overflow: "auto" }}
            renderItem={item => (
              <List.Item
                actions={[
                  <SimplePreview fillColor={item.style.fillStyle}
                    strokeColor={item.style.strokeStyle}
                    strokeWidth={this.state.strokeWidth}
                  />
                ]}
              >
                {item.style.name}
              </List.Item>
            )}
          />
        </Item>
      </Form>
    );
  }

  onClassBreakCountChange(e) {
    this.setState({ classBreaksCount: e });
  }

  setColor(newRCColor, colorKey) {
    const newColor = normalizeRCColor(newRCColor.color, newRCColor.alpha);
    this.setState({ [colorKey]: newColor });
  }

  async generateClassBreaks() {
    if (this.state.selectedField === undefined) {
      return;
    }

    this.setState({ loading: true });

    try {
      const fieldValueRange = await this.getFieldValueRange();
      const classBreaks = await this.getClassBreaks(fieldValueRange.minimum, fieldValueRange.maximum);
      this.setState({ classBreaks });

      this.props.classBreaks.length = 0;
      this.props.classBreaks.push(...classBreaks);
    }
    catch (ex) {
      console.error(ex);
      this.setState({ classBreaks: [] });
    }
    finally {
      this.setState({ loading: false });
    }
  }

  async getFieldValueRange() {
    const response = await MapsService.getPropertyByField(
      this.state.selectedField,
      this.state.layerID,
      this.state.groupID,
      this.state.mapID,
      ['min', 'max']
    );

    let minimum = undefined;
    let maximum = undefined;
    if (response.status === 200) {
      const minimumRecord = response.data.find(f => f.minimum);
      if (minimumRecord !== undefined) {
        minimum = minimumRecord.minimum;
      }
      const maximumRecord = response.data.find(f => f.maximum);
      if (maximumRecord !== undefined) {
        maximum = maximumRecord.maximum;
      }

      return { minimum, maximum };
    }
    else {
      console.error(response.data);
    }

    throw new Error(`Fetch field (${this.state.style.field}) value range failed.`);
  }

  async getClassBreaks(min, max) {
    const classBreakValues = this.getClassBreakValues(min, max);
    const classBreakColors = await Promise.all([
      this.getClassBreakFillColors(),
      this.getClassBreakStrokeColors()
    ]);

    const classBreaks = [];
    for (let i = 0; i < classBreakValues.length; i++) {
      let classBreak = {
        minimum: classBreakValues[i].min,
        maximum: classBreakValues[i].max
      };

      if (GeomUtils.isAreaGeometry(this.props.geomType)) {
        const fillColor = classBreakColors[0][i];
        const strokeColor = classBreakColors[1][i];
        const strokeWidth = this.state.strokeWidth;
        const style = StyleTemplates.getFillStyle(fillColor, strokeColor, strokeWidth);
        classBreak = Object.assign(classBreak, { style });
      }
      else if (GeomUtils.isLineGeometry(this.props.geomType)) {
        const strokeColor = classBreakColors[1][i];
        const strokeWidth = this.state.strokeWidth;
        const style = StyleTemplates.getLineStyle(strokeColor, strokeWidth);
        classBreak = Object.assign(classBreak, { style });
      }
      else if (GeomUtils.isPointGeometry(this.props.geomType)) {
        const fillColor = classBreakColors[0][i];
        const strokeColor = classBreakColors[1][i];
        const strokeWidth = this.state.strokeWidth;
        const style = StyleTemplates.getPointStyle('circle', fillColor, strokeColor, strokeWidth, 40);
        classBreak = Object.assign(classBreak, { style });
      }

      if (classBreak.style) {
        const minimum = Math.round(classBreak.minimum);
        const maximum = Math.round(classBreak.maximum);
        classBreak.style.name = `${minimum} - ${maximum}`;
      }

      classBreaks.push(classBreak);
    }

    return classBreaks;
  }

  getClassBreakValues(min, max) {
    const breakCount = this.state.classBreaksCount;
    const breakIncrement = Math.abs(max - min) / breakCount;
    const classBreakValues = [];
    for (let i = 0; i < breakCount; i++) {
      const currentMin = min + i * breakIncrement;
      const currentMax = currentMin + breakIncrement;
      classBreakValues.push({ min: currentMin, max: currentMax });
    }

    return classBreakValues;
  }

  async getClassBreakFillColors() {
    const count = this.state.classBreaksCount;
    const fillColors = await UtilitiesService.getBreakDownColors(this.state.fillColor1, this.state.fillColor2, count);
    return fillColors.data;
  }

  async getClassBreakStrokeColors() {
    const count = this.state.classBreaksCount;
    if (this.state.strokeWidth === 0) {
      return [];
    }

    const strokeColors = await UtilitiesService.getBreakDownColors(this.state.strokeColor1, this.state.strokeColor2, count);
    return strokeColors.data;
  }
}