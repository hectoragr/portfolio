import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Resume from './Resume';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
}));

vi.mock('../commons/work-experience.json', () => ({
  default: {
    en: {
      jobs: [
        {
          title: 'Front End Engineer II',
          company: 'Amazon Leo (through INSPYR Solutions)',
          location: 'Redmond, WA (US)',
          startDate: '2026-03-31',
          endDate: null,
          description: 'Front-end engineer working for Amazon Leo.',
          bullets: ['React and RTL for dashboards'],
          skills: ['React', 'TypeScript'],
        },
      ],
      education: [
        {
          degree: 'B.Sc. Digital Systems and Robotics Eng.',
          institution: 'Tecnológico de Monterrey',
          location: 'Monterrey, Nuevo León (MX)',
          startDate: '2007-08-01',
          endDate: '2013-12-01',
          description: 'Full stack of technology, from hardware to software.',
        },
      ],
      other: {
        description: 'Outside of work I have hobbies.',
        hobbies: ['Hiking'],
        languages: [{ name: 'Spanish', level: 'Native' }],
        interests: ['Technology'],
      },
    },
    es: {
      jobs: [
        {
          title: 'Front End Engineer II',
          company: 'Amazon Leo (a través de INSPYR Solutions)',
          location: 'Redmond, WA (EUA)',
          startDate: '2026-03-31',
          endDate: null,
          description: 'Ingeniero front-end trabajando para Amazon Leo.',
          bullets: ['React y RTL para paneles'],
          skills: ['React', 'TypeScript'],
        },
      ],
      education: [
        {
          degree: 'Ingeniería en Sistemas Digitales y Robótica',
          institution: 'Tecnológico de Monterrey',
          location: 'Monterrey, Nuevo León (MX)',
          startDate: '2007-08-01',
          endDate: '2013-12-01',
          description: 'Cursé esta carrera para experimentar tecnología.',
        },
      ],
      other: {
        description: 'Fuera del trabajo tengo pasatiempos.',
        hobbies: ['Senderismo'],
        languages: [{ name: 'Español', level: 'Nativo' }],
        interests: ['Tecnología'],
      },
    },
  },
}));

describe('Resume', () => {
  const renderResume = () =>
    render(
      <HelmetProvider>
        <Resume />
      </HelmetProvider>
    );

  it('renders the Download button with correct label', () => {
    renderResume();
    expect(screen.getByText(/Download \/ Print/)).toBeInTheDocument();
  });

  it('calls window.print() when Download button is clicked', () => {
    const printMock = vi.fn();
    vi.stubGlobal('print', printMock);

    renderResume();
    fireEvent.click(screen.getByText(/Download \/ Print/));
    expect(printMock).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('renders work experience section', () => {
    renderResume();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText(/Amazon Leo \(through INSPYR Solutions\)/)).toBeInTheDocument();
    expect(screen.getByText('React and RTL for dashboards')).toBeInTheDocument();
  });

  it('renders education section', () => {
    renderResume();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText(/Tecnológico de Monterrey/)).toBeInTheDocument();
  });
});
