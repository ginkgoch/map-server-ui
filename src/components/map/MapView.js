import React, { Component } from 'react';
import { Map, TileLayer } from "react-leaflet";
import { Config } from "../../shared";

export class MapView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const position = [51.505, -0.09]
        return (
        <Map center={position} zoom={3}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <TileLayer ref={el => this.props.assignTileLayer(el)}
                url={Config.serviceUrl('maps/1/image/xyz/{z}/{x}/{y}')}
            />
        </Map>
        );
    }
}