import React, { Component } from 'react';

export const SimplePreview = props => {
    const styleProp = {
        style: {
            backgroundColor: props.fillColor,
            border: `solid ${ props.strokeWidth || 0 }px ${ props.strokeColor }`
        }
    };
    return (<div className="preview-simple" {...styleProp}></div>);
};