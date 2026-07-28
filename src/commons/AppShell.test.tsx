import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AppShell from './AppShell';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
}));

vi.mock('./Sidebar', () => ({
  default: ({ onNavClick }: { onNavClick: () => void }) => (
    <div data-testid="sidebar">
      <button onClick={onNavClick}>Nav link</button>
    </div>
  ),
}));

describe('AppShell', () => {
  it('renders sidebar and children', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <div data-testid="content">Page content</div>
        </AppShell>
      </MemoryRouter>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('hamburger click adds open class to sidebar-wrapper', () => {
    render(
      <MemoryRouter>
        <AppShell><div /></AppShell>
      </MemoryRouter>
    );
    const wrapper = document.querySelector('.sidebar-wrapper')!;
    expect(wrapper.classList.contains('open')).toBe(false);
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(wrapper.classList.contains('open')).toBe(true);
  });

  it('overlay appears when sidebar is open', () => {
    render(
      <MemoryRouter>
        <AppShell><div /></AppShell>
      </MemoryRouter>
    );
    expect(document.querySelector('.sidebar-overlay')).toBeNull();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(document.querySelector('.sidebar-overlay')).toBeInTheDocument();
  });

  it('clicking overlay closes sidebar', () => {
    render(
      <MemoryRouter>
        <AppShell><div /></AppShell>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(document.querySelector('.sidebar-wrapper')!.classList.contains('open')).toBe(true);
    fireEvent.click(document.querySelector('.sidebar-overlay')!);
    expect(document.querySelector('.sidebar-wrapper')!.classList.contains('open')).toBe(false);
  });

  it('onNavClick from sidebar closes the sidebar', () => {
    render(
      <MemoryRouter>
        <AppShell><div /></AppShell>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(document.querySelector('.sidebar-wrapper')!.classList.contains('open')).toBe(true);
    fireEvent.click(screen.getByText('Nav link'));
    expect(document.querySelector('.sidebar-wrapper')!.classList.contains('open')).toBe(false);
  });
});
