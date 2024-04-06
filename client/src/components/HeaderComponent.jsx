import React from 'react';
import { Link } from 'react-router-dom';

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { title, links } = this.props;

        return (
            <header>
                <h1>{title}</h1>
                <nav>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path}>{link.title}</Link>
                        </li>
                    ))}
                </nav>
            </header>
        );
    }
};

export default HeaderComponent;