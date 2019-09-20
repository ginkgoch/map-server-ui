import React, { Component } from 'react';
import { Checkbox, Button, Popover } from 'antd';

export class ColumnFilter extends Component {
    constructor(props) {
        super(props);

        this.state = ColumnFilter.getStateFromProps(props);

        this.selectedColumns = [];
    }

    static getDerivedStateFromProps(nextProps, preState) {
        const currentColumns = ColumnFilter.getStateFromProps(nextProps);
        if (currentColumns != preState.columns) {
            return ColumnFilter.getStateFromProps(nextProps);
        }

        return null;
    }

    render() {
        const checkboxGroup = (
            <div>
                <Checkbox.Group className="column-filter-group" options={this.state.columns} onChange={columns => this.onColumnSelectionChange(columns)}></Checkbox.Group>
                <div className="confirm-btn-container">
                    <Button>Cancel</Button>
                    <Button type="primary" onClick={ () => this.onColumnSelectionConfirm() }>OK</Button>
                </div>
            </div>
        );

        return (
            <Popover title="Select Columns" 
                trigger="click" 
                content={checkboxGroup} 
                visible={this.state.columnFilterVisible}
                onVisibleChange={visible => this.setColumnFilterVisible(visible)}>
                <Button>Visible Columns {this.selectedColumns.length === 0 ? '(ALL)' : `(${this.selectedColumns.length}/${this.state.columns.length})`}</Button>
            </Popover>
        );
    }

    onColumnSelectionChange(columns) {
        this.selectedColumns = columns;
    }

    onColumnSelectionConfirm() {
        this.props && this.props.onConfirm(this.selectedColumns);
        this.setColumnFilterVisible(false);
    }

    setColumnFilterVisible(visible) {
        this.setState({ columnFilterVisible: visible });
    }

    static getStateFromProps(props) {
        return { columns: props.columns.map(c => ({ label: c, value: c })) };
    }
}