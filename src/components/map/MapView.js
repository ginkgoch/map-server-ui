import React, { Component } from 'react';
import { Map, TileLayer } from "react-leaflet";

export class MapView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const position = [51.505, -0.09]
        return (
        <Map center={position} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
        </Map>
        );
    }
}