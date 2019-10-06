import React from "react";
import { Render } from "./Render";

export class LayerPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { layer: props.layer };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (preState.layer !== nextProps) {
      return { layer: nextProps.layer };
    }

    return null;
  }

  render() {
    return (
      <canvas
        width="20"
        height="20"
        ref={canvas => (this.canvas = canvas)}
        style={{ verticalAlign: "middle" }}
      />
    );
  }

  componentDidMount() {
    Render.renderLayer(this.state.layer, this.canvas);
  }

  componentDidUpdate() {
    Render.renderLayer(this.state.layer, this.canvas);
  }
}
