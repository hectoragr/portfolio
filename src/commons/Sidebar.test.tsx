import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { changeLanguage: mockChangeLanguage, language: 'en' },
  }),
}));

describe('Sidebar', () => {
  it('renders nav links', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Socials')).toBeInTheDocument();
  });

  it('calls changeLanguage when EN button clicked', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByText('EN'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage when ES button clicked', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByText('ES'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('calls onNavClick when a nav link is clicked', () => {
    const onNavClick = vi.fn();
    render(<MemoryRouter><Sidebar onNavClick={onNavClick} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Home'));
    expect(onNavClick).toHaveBeenCalled();
  });
});
