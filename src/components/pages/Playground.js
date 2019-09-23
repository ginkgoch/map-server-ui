import React, { Component } from 'react';
import { DataTable } from '../properties';
import { ValueItems } from '../styles/ValueItems';

export class Playground extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <DataTable layerID="layer-vyrwgp22" groupID="Default" mapID="1" />
            <div style={{width: 600, margin: '10px auto'}}>
                <ValueItems></ValueItems>
            </div>
        );
    }
}