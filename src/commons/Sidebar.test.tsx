import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';

const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { changeLanguage: mockChangeLanguage, language: 'en' },
  }),
}));

const renderSidebar = (onNavClick: () => void = () => {}) =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <Sidebar onNavClick={onNavClick} />
      </ThemeProvider>
    </MemoryRouter>
  );

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders nav links', () => {
    renderSidebar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('AI Chat link opens chat.hectoragomez.com in new tab', () => {
    renderSidebar();
    const chatLink = screen.getByText('AI Chat').closest('a')!;
    expect(chatLink).toHaveAttribute('href', 'https://chat.hectoragomez.com');
    expect(chatLink).toHaveAttribute('target', '_blank');
  });

  it('calls changeLanguage when EN button clicked', () => {
    renderSidebar();
    fireEvent.click(screen.getByText('EN'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage when ES button clicked', () => {
    renderSidebar();
    fireEvent.click(screen.getByText('ES'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('calls onNavClick when a nav link is clicked', () => {
    const onNavClick = vi.fn();
    renderSidebar(onNavClick);
    fireEvent.click(screen.getByText('Home'));
    expect(onNavClick).toHaveBeenCalled();
  });

  it('theme toggle exposes the action it performs and flips on click', () => {
    renderSidebar();
    // jsdom's matchMedia stub reports no light preference, so we start dark.
    const toggle = screen.getByLabelText('Switch to light theme');
    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument();
  });
});
