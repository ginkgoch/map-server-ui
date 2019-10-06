import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { minSelectWidth, FontUtils } from './FontShared';

export const FontSizeInput = props => {
    const fontComponents = FontUtils.parseFontComponents(props.font);
    const passThroughProps = _.omit(props, ['onFontChange']);

    return <InputNumber 
        defaultValue={fontComponents.fontSize} 
        placeholder="Input font size" 
        min="0"
        style={{ minWidth: minSelectWidth }} 
        onChange={newFontSize => {
            fontComponents.fontSize = newFontSize;
            const newFont = FontUtils.stringifyFontComponents(fontComponents);
            props.onFontChange && props.onFontChange(newFont);
        }}
        {...passThroughProps} />
}