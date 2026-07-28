import React from 'react';
import './404.css';
import { useTranslation } from 'react-i18next';

function FourOhFour() {
    const { t } = useTranslation();
    return (
        <div className="four-oh-four centered-content">
            <h1 className="sr-only">{t('404.title', 'Page not found')}</h1>
            <p><img src="img/chatgpt-404-octopus.png" alt="Page not found" /></p>
            <p style={{ textAlign: 'center' }}>{t('404.p1', 'The page you are looking for does not exist.')}</p>
            <p style={{ textAlign: 'center' }}>{t('404.p2','Please check the URL or return to')} <a href="/">{t('home.title', 'Home')}</a>.</p>
        </div>
    );
}

export default FourOhFour;