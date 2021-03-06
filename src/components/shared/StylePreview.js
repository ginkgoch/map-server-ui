import React from "react";
import { Render } from "./Render";

export class StylePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = { style: props.style };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (preState.style !== nextProps.style) {
      return { style: nextProps.style };
    }

    return null;
  }

  render() {
    const width = this.props.width || 20;
    const height = this.props.height || 20;

    return (
      <canvas
        width={width}
        height={height}
        ref={canvas => (this.canvas = canvas)}
        style={{ verticalAlign: "middle" }}
      />
    );
  }

  componentDidMount() {
    Render.renderStyle(this.state.style, this.canvas);
  }

  componentDidUpdate() {
    Render.renderStyle(this.state.style, this.canvas);
  }
}
