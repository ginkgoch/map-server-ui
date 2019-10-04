import React, { Component } from 'react';
import { Select } from 'antd';
import { minSelectWidth, defaultFontStyles, FontUtils } from './FontShared';

export const FontStyleSelect = props => {
    const fontComponents = FontUtils.parseFontComponents(props.font);
    const passThroughProps = _.omit(props, ['onFontChange']);

    return <Select className="select-option-item" 
        defaultValue={fontComponents.fontStyle} 
        placeholder="Select font style" 
        style={{ minWidth: minSelectWidth }} 
        onChange={newFontStyle => {
            fontComponents.fontStyle = newFontStyle;
            const newFont = FontUtils.stringifyFontComponents(fontComponents);
            props.onFontChange && props.onFontChange(newFont);
        }}
        {...passThroughProps}>
        {defaultFontStyles.map(f => <Select.Option key={f} value={f}>
            <span className="select-option-item" style={{ fontStyle: f }}>{f}</span>
        </Select.Option>)}
    </Select>
}