import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@app/shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '@app/shared/components/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="dashboard-container" [attr.data-theme]="isDarkMode ? 'dark' : 'light'">
      <app-topbar (toggleSidebar)="onToggleSidebar()"></app-topbar>
      <div class="dashboard-content">
        <app-sidebar #sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
        <div class="sidebar-overlay" *ngIf="isMobile && sidebarOpen" (click)="closeSidebar()" ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f5f5f5;
        transition: background-color 0.3s ease;
      }

      .dashboard-container[data-theme='dark'] {
        background-color: #1a1f2e;
      }

      .dashboard-content {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
      }

      .main-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        transition: background-color 0.3s ease;
      }

      .dashboard-container[data-theme='dark'] .main-content {
        background-color: #1a1f2e;
        color: #ecf0f1;
      }

      .sidebar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 999;
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 15px;
        }

        .sidebar-overlay {
          display: block;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  sidebarOpen = window.innerWidth > 768;
  isDarkMode = false;
  isMobile = window.innerWidth <= 768;

  constructor() {
    this.loadThemePreference();
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const isMobileView = window.innerWidth <= 768;

    if (this.isMobile !== isMobileView) {
      this.isMobile = isMobileView;
      this.sidebarOpen = !isMobileView;
      if (this.sidebar) {
        this.sidebar.isOpen = this.sidebarOpen;
      }
    }
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  onToggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebar) {
      this.sidebar.isOpen = this.sidebarOpen;
    }
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
      if (this.sidebar) {
        this.sidebar.isOpen = false;
      }
    }
  }
}
