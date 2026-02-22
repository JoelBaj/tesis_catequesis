import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, TooltipModule],
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <button
          pButton
          type="button"
          icon="pi pi-bars"
          class="menu-toggle"
          (click)="onToggleSidebar()"
          [text]="true"
          pTooltip="Menú"
          tooltipPosition="bottom"
        ></button>
      </div>

      <div class="topbar-right">
        <button
          pButton
          type="button"
          [icon]="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
          class="theme-toggle"
          (click)="onToggleTheme()"
          [text]="true"
          pTooltip="Cambiar tema"
          tooltipPosition="bottom"
        ></button>

        <div class="user-profile">
          <div class="user-avatar" #userMenu>
            {{ userInitials }}
          </div>
          <p-menu #menu [model]="menuItems" [popup]="true"></p-menu>
          <button
            pButton
            type="button"
            [text]="true"
            class="user-btn"
            (click)="menu.toggle($event)"
          >
            <span class="user-name">{{ userName }}</span>
            <i class="pi pi-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
        border-bottom: 1px solid #1a252f;
        padding: 15px 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        height: 60px;
        transition: background-color 0.3s ease;
      }

      .topbar.dark {
        background: linear-gradient(90deg, #1a1f2e 0%, #252c3c 100%);
      }

      .topbar-left {
        display: flex;
        align-items: center;
      }

      .menu-toggle {
        font-size: 1.3rem;
        color: white;
        margin-right: 20px;
        cursor: pointer;
        transition: transform 0.2s, color 0.2s;
      }

      .menu-toggle:hover {
        color: #5dade2;
        transform: scale(1.1);
      }

      .topbar-right {
        display: flex;
        align-items: center;
        gap: 20px;
      }


      .theme-toggle {
        font-size: 1.2rem;
        color: white;
        cursor: pointer;
        transition: transform 0.2s, color 0.2s;
      }

      .theme-toggle:hover {
        color: #ffd700;
        transform: rotate(20deg);
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: bold;
        font-size: 0.9rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .user-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        color: white !important;
      }

      .user-btn:hover {
        color: #5dade2 !important;
      }

      .user-name {
        display: none;
        font-size: 0.95rem;
      }

      @media (min-width: 768px) {
        .user-name {
          display: inline;
          font-size: 0.95rem;
        }
      }

      @media (max-width: 768px) {
        .topbar {
          padding: 10px 12px;
        }

        .topbar-right {
          gap: 12px;
        }

        .menu-toggle {
          margin-right: 8px;
        }

        .user-profile {
          gap: 8px;
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          font-size: 0.8rem;
        }
      }

      @media (max-width: 480px) {
        .topbar-right {
          gap: 8px;
        }
      }


      :deep(.p-menu) {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      :deep(.p-button.p-button-text) {
        color: white;
      }

      :deep(.p-button.p-button-text:hover) {
        background-color: rgba(255, 255, 255, 0.1);
      }
    `,
  ],
})
export class TopbarComponent {
  @ViewChild('menu') menu!: Menu;
  @Output() toggleSidebar = new EventEmitter<void>();

  isDarkMode = false;
  userName = '';
  userInitials = '';
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeUser();
    this.setupMenuItems();
    this.loadThemePreference();
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  private initializeUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre && user.rol ? `${user.nombre} / ${user.rol}` : (user.nombre || 'Usuario');
      this.userInitials = this.getInitials(user.nombre || 'Usuario');
    } else {
      this.userName = 'Usuario';
      this.userInitials = 'U';
    }
  }

  private getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('');
  }

  private setupMenuItems(): void {
    this.menuItems = [
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
      },
    ];
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }


  onToggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  onViewProfile(): void {
    // Implement profile view
  }

  onChangePassword(): void {
    // Implement password change modal
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
