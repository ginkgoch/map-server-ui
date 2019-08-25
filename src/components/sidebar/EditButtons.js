import React from "react";
import { Button, Icon } from "antd";

export class EditButtons extends React.Component {
  render() {
    const iconStyle = {
      marginRight: 0
    };

    const btnStyle = {
      marginLeft: 4
    };

    let btns = [];
    if (!this.props.hideEditButton) {
      btns.push({
        type: "edit",
        click: e => {
          e.stopPropagation();
          this.props.onEditButtonClick && this.props.onEditButtonClick(e);
        }
      });
    }

    if (!this.props.hideStyleButton) {
      btns.push({
        type: 'bg-colors',
        click: e => {
          e.stopPropagation();
          this.props.onStyleButtonClick && this.props.onStyleButtonClick(e);
        }
      });
    }

    btns.push({
      type: "close",
      click: e => {
        e.stopPropagation();
        this.props.onCloseButtonClick && this.props.onCloseButtonClick(e);
      }
    });

    btns = btns.map(btn => (
      <Button
        key={btn.type}
        shape="circle"
        size="small"
        style={btnStyle}
        onClick={btn.click}
      >
        <Icon type={btn.type} size="small" style={iconStyle} />
      </Button>
    ));

    return (
      <React.Fragment>
        <div className="edit-buttons">{btns}</div>
      </React.Fragment>
    );
  }
}
