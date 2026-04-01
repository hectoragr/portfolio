import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './HomePage.css';

function HomePage() {
    const { t } = useTranslation();
    return(
        <div className='home-page'>
            <Helmet>
                <title>Héctor A. Gómez Reyes | Software Engineer</title>
                <meta name="description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel. React, TypeScript, Java, and cloud infrastructure." />
                <link rel="canonical" href="https://hectoragomez.com" />
                <meta property="og:url" content="https://hectoragomez.com" />
                <meta property="og:title" content="Héctor A. Gómez Reyes | Software Engineer" />
                <meta property="og:description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel." />
            </Helmet>
            <h1>{t('home.welcome', 'Welcome to my page')}</h1>
            <p>{t('home.description', 'This is my personal website made in React with internationalization support.')}</p>
            <p>{t('home.contact', 'Feel free to navigate this page where you can find my socials, resume and other fun stuff in the navigation bar.')}</p>
            <p>{t('home.chat', 'You can chat with me using the AI Chat feature.')}</p>
            <p>{t('home.languageSwitch', 'You can also switch between English and Spanish using the buttons on the top right corner.')}</p>
            <p>{t('home.footer', 'Thank you for visiting!')}</p>
            <p>{t('home.footerNote', 'This page is a work in progress, so expect changes and improvements over time.')}</p>
        </div>
    );
}

export default HomePage;