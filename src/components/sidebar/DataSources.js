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
            <div style={{ padding: 10 }}>
                <List header={<h3>Data Sources</h3>}
                    footer={
                        <div style={{textAlign: 'right', marginTop: 24}}>
                            <Button>Cancel</Button> <Button type="primary" onClick={this.addToMap()} disabled={!selected}>Add to Map</Button>
                        </div>
                    }
                    dataSource={this.state.dataSources}
                    renderItem={item => (
                        <List.Item key={item.path} actions={[
                            (<Checkbox defaultChecked={item.selected} onChange={e => this.itemSelected(e, item)} />)
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
            console.log(this.state.dataSources.filter(ds => ds.selected));
        };
    }

    itemSelected(e, item) {
        item.selected = e.target.checked;
        this.setState(this.state);
    }
}