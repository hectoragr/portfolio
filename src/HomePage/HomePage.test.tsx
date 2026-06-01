import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../commons/skills.json', () => ({
  default: {
    categories: [
      { name: 'Frontend', nameEs: 'Frontend', skills: ['React', 'TypeScript'] },
    ],
  },
}));

vi.mock('../commons/work-experience.json', () => ({
  default: {
    en: {
      jobs: [
        {
          title: 'SDE II',
          company: 'Oracle America Inc.',
          location: 'Seattle, WA (US)',
          startDate: '2019-04-19',
          endDate: '2025-09-30',
        },
      ],
    },
    es: {
      jobs: [
        {
          title: 'Ingeniero SDE II',
          company: 'Oracle America Inc.',
          location: 'Seattle, WA (EUA)',
          startDate: '2019-04-19',
          endDate: '2025-09-30',
        },
      ],
    },
  },
}));

describe('HomePage', () => {
  it('renders About Me section', () => {
    render(<HomePage />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('renders Skills section', () => {
    render(<HomePage />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders Experience section', () => {
    render(<HomePage />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Oracle America Inc.')).toBeInTheDocument();
  });
});
