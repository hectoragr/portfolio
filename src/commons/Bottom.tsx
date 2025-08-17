import React from 'react';
import { Container } from 'react-bootstrap';
import "./Bottom.css";

const Bottom: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container className="text-center">
                &copy; {year} Hector Gomez
            </Container>
        </footer>
    );
};

export default Bottom;