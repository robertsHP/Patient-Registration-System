import React, { useState, useEffect } from 'react';

import './HeaderComponent.css'

export default class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {

        // };
    }

    render() {
        return (
            <>
                <header>
                    {this.props.pages.map((page, index) => (
                        <button key={page.tableName} className="vertical-button" onClick={() => this.handleClick(index)}>
                            {page.title}
                        </button>
                    ))}
                </header>
            </>
        );
    }

    handleClick(index) {
        // Function to handle button click (replace with your logic)
        this.props.setPageID(index);
    }
}