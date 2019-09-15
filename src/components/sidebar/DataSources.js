import React, { Component } from 'react';
import { DataSourcesService } from '../../services';
import { List, Checkbox, Button } from 'antd';

export class DataSources extends Component {
    constructor(props) {
        super(props);

        this.state = { dataSources: [] };
    }

    async componentDidMount() {
        const response = await DataSourcesService.getDataSources();
        if (response.status === 200) {
            const dataSources = response.data.map(ds => ({ ...ds, selected: false }))
            this.setState({ dataSources });
        }
    }

    render() {
        const selected = this.state.dataSources.some(d => d.selected);

        return (
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <List header="Select following data sources to add onto map."
                    footer={
                        <div style={{textAlign: 'right', marginTop: 24}}>
                            <Button onClick={() => this.props.onCancel()}>Cancel</Button> <Button type="primary" onClick={this.addToMap()} disabled={!selected}>Add to Map</Button>
                        </div>
                    }
                    dataSource={this.state.dataSources}
                    renderItem={item => (
                        <List.Item key={item.path} actions={[
                            (<Checkbox defaultChecked={false} onChange={e => this.itemSelected(e, item)} />)
                        ]}>
                            <List.Item.Meta title={item.name} description={
                                <div>{this.sourceTypeAbbr(item.sourceType)} | {item.geomType.toLowerCase()} | {item.count}</div>
                            }>

                            </List.Item.Meta>
                        </List.Item>
                    )}
                />
            </div>);
    }

    sourceTypeAbbr(sourceType) {
        switch (sourceType) {
            case 'Shapefile': return 'shp';
            default: sourceType.toLowerCase();
        }
    }

    addToMap() {
        return async () => {
            const newLayers = this.state.dataSources.filter(ds => ds.selected);
            this.props.onConfirm(newLayers);
        };
    }

    itemSelected(e, item) {
        item.selected = e.target.checked;
        this.setState(this.state);
    }
}