import React, { Component } from 'react';
import { Map, TileLayer, LayersControl } from "react-leaflet";
import { Config } from "../../shared";

export class MapView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const position = [51.505, -0.09]
        return (
            <Map center={position} zoom={3} onClick={e => this.onClick(e)}>
                <LayersControl position="topright">
                    <LayersControl.Overlay checked name="Open Street Map">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Ginkgoch Map">
                        <TileLayer ref={el => this.props.assignTileLayer(el)}
                            url={Config.serviceUrl('maps/1/image/xyz/{z}/{x}/{y}')}
                        />
                    </LayersControl.Overlay>
                </LayersControl>
            </Map>
        );
    }
}