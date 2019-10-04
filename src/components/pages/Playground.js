import React, { Component } from 'react';
import { DataTable } from '../properties';
import { ValueItems } from '../styles/ValueItems';
import { FontFamilySelect, FontStyleSelect, FontWeightSelect, FontPreview } from '../styles/fonts';
import { FontSizeInput } from '../styles/fonts/FontSizeInput';

export class Playground extends Component {
    constructor(props) {
        super(props);

        this.state = { font: '12px Arial' };
    }

    render() {
        return (
            // <DataTable layerID="layer-vyrwgp22" groupID="Default" mapID="1" />
            <div style={{width: 600, margin: '10px auto'}}>
                {/* <ValueItems layerID="layer-vyrwgp22" groupID="Default" mapID="1"></ValueItems> */}

                <FontFamilySelect font={this.state.font} onFontChange={font => this.setState({ font })} />
                <FontStyleSelect font={this.state.font} onFontChange={font => this.setState({ font })} />
                <FontWeightSelect font={this.state.font} onFontChange={font => this.setState({ font })} />
                <FontSizeInput font={this.state.font} onFontChange={font => this.setState({ font })} />
                <FontPreview font={this.state.font} content="DEMO" />
            </div>
        );
    }
}