import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Nav, Navbar } from 'react-bootstrap';


function TopBar() {

    const { t, i18n} = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
    };


    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">HAGR</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav>
                        <Nav.Link href="/">{t('home.title', 'Home')}</Nav.Link>
                        <Nav.Link href="/faq">Socials</Nav.Link>
                        <Nav.Link href="/resume">{t('resume.title', 'Resume')}</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        <Nav.Link href="#" onClick={() => changeLanguage('en')}>🇺🇸 EN</Nav.Link>
                        <Nav.Link href="#" onClick={() => changeLanguage('es')}>🇲🇽 ES</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopBar;