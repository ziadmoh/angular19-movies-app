import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly DEFAULT_THEME = 'dark';
  
  // Signal for reactive theme state
  public readonly isDarkMode = signal<boolean>(true);

  constructor() {
    // Initialize theme from localStorage or default
    this.initTheme();
    
    // Effect to persist theme changes to localStorage
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      localStorage.setItem(this.THEME_KEY, theme);
      this.applyTheme(theme);
    });
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const theme = savedTheme || this.DEFAULT_THEME;
    this.isDarkMode.set(theme === 'dark');
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  private applyTheme(theme: string): void {
    const htmlElement = document.documentElement;
    if (theme === 'light') {
      htmlElement.setAttribute('data-theme', 'light');
      htmlElement.style.colorScheme = 'light';
    } else {
      htmlElement.removeAttribute('data-theme');
      htmlElement.style.colorScheme = 'dark';
    }
  }
}

