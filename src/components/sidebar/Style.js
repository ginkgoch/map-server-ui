import React from 'react';
import StylePreview from '../shared/StylePreview';
import {EditButtons} from '.';

export class Style extends React.Component {
    constructor(props) {
        super(props);

        this.state = {style: props.style};
    }

    render() {
        const style = this.state.style;
        return (
            <div className="sidebar-item">
                <div>
                    <StylePreview style={ style }></StylePreview>
                    <span className="style-label">{style.name}</span>
                </div>
                
                {
                    this._renderEditButton()
                }
            </div>
        );
    }

    _renderEditButton() {
        if (!this.props.hideEditButtons) {
            return (
                <div>
                    <EditButtons></EditButtons>
                </div>
            )
        }
    }
}