import React from 'react';
import { Style } from ".";

export class ClassBreaks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { classBreaks: props.classBreaks }
    }

    render() { 
        const classBreaks = this.state.classBreaks;
        return (  
            <ul style={{listStyleType: "none", paddingLeft: "20px", fontSize: "10px", fontFamily: "verdana"}}>
                {
                    classBreaks.map(cb => {
                        return (
                            <li key={cb.style.id}>
                                <Style style={cb.style} hideEditButtons={true}></Style>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}