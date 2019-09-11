import React, { Component, Fragment } from "react";
import { MapsService } from "../../services/maps/MapsService";
import { List, Row, Col, Button, Icon, Modal, Popconfirm } from "antd";
import moment from "moment";
import { MapInfoModal } from "../header/MapInfoModal";

const ListHeader = props => (
    <div className="map-list-header">
        <h2 className="map-list-header-item">All Maps</h2>
        <div className="map-list-header-item">
            <Button shape="circle-outline" size="small" onClick={props.onClick}>
                <Icon type="plus" />
            </Button>
        </div>
    </div>
);

export class MapList extends Component {
    constructor(props) {
        super(props);

        this.state = { maps: [], mapInfoModalVisible: false };
    }

    async componentDidMount() {
        this.resetList();
    }

    render() {
        return (
            <Fragment>
                <Row className="map-list">
                    <Col offset={6} span={12}>
                        <List
                            size="large"
                            dataSource={this.state.maps}
                            header={
                                <ListHeader onClick={this.setMapInfoModalVisible.bind(this, true)} />
                            }
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    actions={[
                                        <Popconfirm
                                            title="Are you sure to remove map?"
                                            onConfirm={async e =>
                                                await this.onDeleteClick(e, item.id)
                                            }
                                        >
                                            <Button shape="circle" size="small">
                                                <Icon type="minus" />
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<span className="map-list-item-title"><a href="#">{item.name}</a></span>}
                                        description={
                                            <div>
                                                <div className="map-list-item-desc">
                                                    {item.description}
                                                </div>
                                                <div className="map-list-item-extra">
                                                    <span>{item.creator}</span>
                                                    <span>
                                                        Last Update {moment(item.updateAt).format("L")}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    ></List.Item.Meta>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <MapInfoModal
                    visible={this.state.mapInfoModalVisible}
                    onCancel={this.setMapInfoModalVisible.bind(this, false)}
                    onMapCreated={newMapInfo => this.onMapCreated(newMapInfo)}
                ></MapInfoModal>
            </Fragment>
        );
    }

    async onDeleteClick(e, id) {
        e.preventDefault();
        e.stopPropagation();

        try {
            await MapsService.deleteMapByID(id);
            await this.resetList();
        } catch (ex) {
            Modal.error({
                title: "Delete Map Failed",
                content: ex.toString()
            });
        }
    }

    async resetList() {
        const response = await MapsService.getMaps();
        const maps = response.data;
        this.setState({ maps });
    }

    async onMapCreated(newMapInfo) {
        const response = await MapsService.create(
            newMapInfo.name,
            newMapInfo.crs,
            newMapInfo.description
        );
        if (response.status === 200) {
            this.setMapInfoModalVisible(false);
            await this.resetList();
        }
    }

    setMapInfoModalVisible(visible) {
        this.setState({ mapInfoModalVisible: visible });
    }
}