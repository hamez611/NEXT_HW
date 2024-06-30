import React from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <Link to="/">메인화면</Link>
                    </li>
                    <li>
                        <Link to="/bike">따릉따릉</Link>
                    </li>
                    <li>
                        <Link to="/about">만든 사람</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
