import React from 'react';

import './SidebarComponent.css';

class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div className="sidebar">
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                        {/* Add more items as needed */}
                    </ul>
                </div>
            </div>
        );
    }
};

export default SidebarComponent;