import React from 'react';
import { useTranslation } from 'react-i18next';
import './HomePage.css';

function HomePage() {
    const { t } = useTranslation();
    return(
        <div className='home-page'>
            <h1>{t('home.welcome', 'Welcome to my page')}</h1>
            <p>{t('home.description', 'This is my personal website made in React with internationalization support.')}</p>
            <p>{t('home.contact', 'Feel free to navigate this page where you can find my socials, resume and other fun stuff in the navigation bar.')}</p>
            <p>{t('home.footer', 'Thank you for visiting!')}</p>
            <p>{t('home.footerNote', 'This page is a work in progress, so expect changes and improvements over time.')}</p>
        </div>
    );
}

export default HomePage;