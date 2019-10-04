import React, { Component } from 'react';
import { FontUtils } from '.';

export const FontPreview = props => {
    const fontComponents = FontUtils.parseFontComponents(props.font);
    return <div>
        <div style={{
            fontSize: fontComponents.fontSize,
            fontStyle: fontComponents.fontStyle,
            fontWeight: fontComponents.fontWeight,
            fontFamily: fontComponents.fontFamily,
            textOverflow: 'ellipsis'
        }}>{props.content || props.font}</div>
    </div>;
};