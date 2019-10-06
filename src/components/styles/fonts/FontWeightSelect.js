import React, { Component } from 'react';
import { Select } from 'antd';
import { minSelectWidth, defaultFontWeights, FontUtils } from './FontShared';

export const FontWeightSelect = props => {
    const fontComponents = FontUtils.parseFontComponents(props.font);
    const passThroughProps = _.omit(props, ['onFontChange']);

    return <Select className="select-option-item" 
        defaultValue={fontComponents.fontWeight} 
        placeholder="Select font weight" 
        style={{ minWidth: minSelectWidth }} 
        onChange={newFontWeight => {
            fontComponents.fontWeight = newFontWeight;
            const newFont = FontUtils.stringifyFontComponents(fontComponents);
            props.onFontChange && props.onFontChange(newFont);
        }}
        {...passThroughProps}>
        {defaultFontWeights.map(f => <Select.Option key={f} value={f}>
            <span className="select-option-item" style={{ fontWeight: f }}>{f}</span>
        </Select.Option>)}
    </Select>
}