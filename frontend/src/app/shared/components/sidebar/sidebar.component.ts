import { Component } from '@angular/core';
import { AuthService, User } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.visible]="isOpen">
      <div class="sidebar-header">
        <div class="logo">
          <i class="pi pi-book"></i>
          <h2>Sistema GCP</h2>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Menú por rol, sin duplicación -->
        <ng-container [ngSwitch]="user?.rol">
          <!-- ADMIN -->
          <ng-container *ngSwitchCase="'ADMIN'">
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('configuracion')">
              <button class="section-toggle" (click)="toggleSection('configuracion')">
                <h3 class="section-title">CONFIGURACIÓN</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('configuracion')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/parameter-types']" routerLinkActive="active">
                <i class="pi pi-list"></i>
                <span>Tipos de Parámetros</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('personas')">
              <button class="section-toggle" (click)="toggleSection('personas')">
                <h3 class="section-title">PERSONAS</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('personas')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/persons']" routerLinkActive="active">
                <i class="pi pi-user"></i>
                <span>Personas</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/students']" routerLinkActive="active">
                <i class="pi pi-user-edit"></i>
                <span>Catequizandos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/catechists']" routerLinkActive="active">
                <i class="pi pi-user-plus"></i>
                <span>Catequistas</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('academico')">
              <button class="section-toggle" (click)="toggleSection('academico')">
                <h3 class="section-title">ACADÉMICO</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('academico')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/courses']" routerLinkActive="active">
                <i class="pi pi-folder"></i>
                <span>Cursos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/levels']" routerLinkActive="active">
                <i class="pi pi-list-check"></i>
                <span>Niveles</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/planning']" routerLinkActive="active">
                <i class="pi pi-calendar"></i>
                <span>Planificación</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/grades']" routerLinkActive="active">
                <i class="pi pi-book"></i>
                <span>Calificaciones</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('asistencia')">
              <button class="section-toggle" (click)="toggleSection('asistencia')">
                <h3 class="section-title">ASISTENCIA</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('asistencia')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/encounters']" routerLinkActive="active">
                <i class="pi pi-calendar-times"></i>
                <span>Encuentros</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/attendances']" routerLinkActive="active">
                <i class="pi pi-check"></i>
                <span>Asistencia a Encuentros</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('eventos')">
              <button class="section-toggle" (click)="toggleSection('eventos')">
                <h3 class="section-title">EVENTOS</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('eventos')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/events']" routerLinkActive="active">
                <i class="pi pi-calendar-plus"></i>
                <span>Eventos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/event-attendances']" routerLinkActive="active">
                <i class="pi pi-check-circle"></i>
                <span>Asistencias a Eventos</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('matriculas')">
              <button class="section-toggle" (click)="toggleSection('matriculas')">
                <h3 class="section-title">MATRÍCULAS</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('matriculas')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/enrollments']" routerLinkActive="active">
                <i class="pi pi-envelope"></i>
                <span>Matrículas</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('sistema')">
              <button class="section-toggle" (click)="toggleSection('sistema')">
                <h3 class="section-title">SISTEMA</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('sistema')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/users']" routerLinkActive="active">
                <i class="pi pi-user-shield"></i>
                <span>Usuarios</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('notificaciones')">
              <button class="section-toggle" (click)="toggleSection('notificaciones')">
                <h3 class="section-title">NOTIFICACIONES</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('notificaciones')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Evento' }" routerLinkActive="active">
                <i class="pi pi-calendar"></i>
                <span>Evento</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Encuentro' }" routerLinkActive="active">
                <i class="pi pi-calendar-times"></i>
                <span>Encuentro</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Inasistencias' }" routerLinkActive="active">
                <i class="pi pi-exclamation-circle"></i>
                <span>Ausencias</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Notas' }" routerLinkActive="active">
                <i class="pi pi-book"></i>
                <span>Notas</span>
              </a>
            </div>
          </ng-container>
          <!-- COORDINADOR y CATEQUISTA -->
          <ng-container *ngSwitchCase="'coordinador'">
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('academico')">
              <button class="section-toggle" (click)="toggleSection('academico')">
                <h3 class="section-title">ACADÉMICO</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('academico')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/courses']" routerLinkActive="active">
                <i class="pi pi-folder"></i>
                <span>Cursos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/levels']" routerLinkActive="active">
                <i class="pi pi-list-check"></i>
                <span>Niveles</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/planning']" routerLinkActive="active">
                <i class="pi pi-calendar"></i>
                <span>Planificación</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/grades']" routerLinkActive="active">
                <i class="pi pi-book"></i>
                <span>Calificaciones</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('asistencia')">
              <button class="section-toggle" (click)="toggleSection('asistencia')">
                <h3 class="section-title">ASISTENCIA</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('asistencia')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/encounters']" routerLinkActive="active">
                <i class="pi pi-calendar-times"></i>
                <span>Encuentros</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/attendances']" routerLinkActive="active">
                <i class="pi pi-check"></i>
                <span>Asistencia a Encuentros</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('eventos')">
              <button class="section-toggle" (click)="toggleSection('eventos')">
                <h3 class="section-title">EVENTOS</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('eventos')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/events']" routerLinkActive="active">
                <i class="pi pi-calendar-plus"></i>
                <span>Eventos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/event-attendances']" routerLinkActive="active">
                <i class="pi pi-check-circle"></i>
                <span>Asistencias a Eventos</span>
              </a>
            </div>
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('notificaciones')">
              <button class="section-toggle" (click)="toggleSection('notificaciones')">
                <h3 class="section-title">NOTIFICACIONES</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('notificaciones')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Evento' }" routerLinkActive="active">
                <i class="pi pi-calendar"></i>
                <span>Evento</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Encuentro' }" routerLinkActive="active">
                <i class="pi pi-calendar-times"></i>
                <span>Encuentro</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Inasistencias' }" routerLinkActive="active">
                <i class="pi pi-exclamation-circle"></i>
                <span>Ausencias</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Notas' }" routerLinkActive="active">
                <i class="pi pi-book"></i>
                <span>Notas</span>
              </a>
            </div>
          </ng-container>
          <ng-container *ngSwitchCase="'catequista'">
            <div class="menu-section" [class.collapsed]="isSectionCollapsed('academico')">
              <button class="section-toggle" (click)="toggleSection('academico')">
                <h3 class="section-title">ACADÉMICO</h3>
                <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('academico')"></i>
              </button>
              <a class="menu-item" [routerLink]="['/dashboard/courses']" routerLinkActive="active">
                <i class="pi pi-folder"></i>
                <span>Cursos</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/levels']" routerLinkActive="active">
                <i class="pi pi-list-check"></i>
                <span>Niveles</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/planning']" routerLinkActive="active">
                <i class="pi pi-calendar"></i>
                <span>Planificación</span>
              </a>
              <a class="menu-item" [routerLink]="['/dashboard/grades']" routerLinkActive="active">
                <i class="pi pi-book"></i>
                <span>Calificaciones</span>
              </a>
            </div>
                        <div class="menu-section" [class.collapsed]="isSectionCollapsed('asistencia')">
                          <button class="section-toggle" (click)="toggleSection('asistencia')">
                            <h3 class="section-title">ASISTENCIA</h3>
                            <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('asistencia')"></i>
                          </button>
                          <a class="menu-item" [routerLink]="['/dashboard/encounters']" routerLinkActive="active">
                            <i class="pi pi-calendar-times"></i>
                            <span>Encuentros</span>
                          </a>
                          <a class="menu-item" [routerLink]="['/dashboard/attendances']" routerLinkActive="active">
                            <i class="pi pi-check"></i>
                            <span>Asistencia a Encuentros</span>
                          </a>
                        </div>
                        <div class="menu-section" [class.collapsed]="isSectionCollapsed('eventos')">
                          <button class="section-toggle" (click)="toggleSection('eventos')">
                            <h3 class="section-title">EVENTOS</h3>
                            <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('eventos')"></i>
                          </button>
                          <a class="menu-item" [routerLink]="['/dashboard/events']" routerLinkActive="active">
                            <i class="pi pi-calendar-plus"></i>
                            <span>Eventos</span>
                          </a>
                          <a class="menu-item" [routerLink]="['/dashboard/event-attendances']" routerLinkActive="active">
                            <i class="pi pi-check-circle"></i>
                            <span>Asistencias a Eventos</span>
                          </a>
                        </div>
                        <div class="menu-section" [class.collapsed]="isSectionCollapsed('matriculas')">
                          <button class="section-toggle" (click)="toggleSection('matriculas')">
                            <h3 class="section-title">MATRÍCULAS</h3>
                            <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('matriculas')"></i>
                          </button>
                          <a class="menu-item" [routerLink]="['/dashboard/enrollments']" routerLinkActive="active">
                            <i class="pi pi-envelope"></i>
                            <span>Matrículas</span>
                          </a>
                        </div>
                        <div class="menu-section" [class.collapsed]="isSectionCollapsed('notificaciones')">
                          <button class="section-toggle" (click)="toggleSection('notificaciones')">
                            <h3 class="section-title">NOTIFICACIONES</h3>
                            <i class="pi pi-chevron-down" [class.rotated]="!isSectionCollapsed('notificaciones')"></i>
                          </button>
                          <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Evento' }" routerLinkActive="active">
                            <i class="pi pi-calendar"></i>
                            <span>Evento</span>
                          </a>
                          <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Encuentro' }" routerLinkActive="active">
                            <i class="pi pi-calendar-times"></i>
                            <span>Encuentro</span>
                          </a>
                          <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Inasistencias' }" routerLinkActive="active">
                            <i class="pi pi-exclamation-circle"></i>
                            <span>Ausencias</span>
                          </a>
                          <a class="menu-item" [routerLink]="['/dashboard/notifications']" [queryParams]="{ type: 'Notas' }" routerLinkActive="active">
                            <i class="pi pi-book"></i>
                            <span>Notas</span>
                          </a>
                        </div>
          <!-- End of sidebar menu sections -->
  `,
  styles: [
    `
      .sidebar {
        width: 265px;
        background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
        border-right: 1px solid #1a252f;
        overflow-y: auto;
        height: calc(100vh - 60px);
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
        z-index: 950;
        position: relative;
      }

      .sidebar:not(.visible) {
        width: 0;
        transform: translateX(-100%);
        border-right: none;
        overflow: hidden;
      }

      .sidebar.visible {
        transform: translateX(0);
      }

      .sidebar-header {
        padding: 25px 20px;
        border-bottom: 2px solid #5dade2;
        background: linear-gradient(180deg, #34495e 0%, #2c3e50 100%);
        flex-shrink: 0;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
      }

      .logo i {
        font-size: 1.8rem;
        color: #5dade2;
      }

      .sidebar-header h2 {
        margin: 0;
        color: white;
        font-size: 1.2rem;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        padding: 15px 0;
      }

      .menu-section {
        margin-bottom: 5px;
      }

      .section-toggle {
        width: 100%;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0;
        cursor: pointer;
      }

      .section-toggle i {
        color: #95a5a6;
        transition: transform 0.2s ease, color 0.2s ease;
        margin-right: 20px;
      }

      .section-toggle:hover i {
        color: #5dade2;
      }

      .section-toggle .rotated {
        transform: rotate(180deg);
      }

      .section-title {
        margin: 20px 20px 10px 20px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #95a5a6;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      .menu-section:first-child .section-title {
        margin-top: 5px;
      }

      .menu-section.collapsed .menu-item {
        display: none;
      }

      .menu-section.collapsed .section-title {
        margin-bottom: 12px;
      }

      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        color: #bdc3c7;
        text-decoration: none;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        cursor: pointer;
        border-left: 3px solid transparent;
      }

      .menu-item i {
        width: 20px;
        font-size: 1rem;
        color: #95a5a6;
        transition: color 0.2s ease;
      }

      .menu-item:hover {
        background-color: rgba(93, 173, 226, 0.1);
        color: #5dade2;
        padding-left: 22px;
        border-left-color: #5dade2;
      }

      .menu-item:hover i {
        color: #5dade2;
      }

      .menu-item.active {
        background-color: rgba(93, 173, 226, 0.15);
        color: #5dade2;
        font-weight: 600;
        border-left-color: #5dade2;
      }

      .menu-item.active i {
        color: #5dade2;
      }

      @media (max-width: 768px) {
        .sidebar {
          width: min(86vw, 320px);
          position: fixed;
          left: 0;
          top: 60px;
          height: calc(100vh - 60px);
          z-index: 1000;
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
          transform: translateX(-100%);
        }

        .sidebar:not(.visible) {
          width: min(86vw, 320px);
          border-right: 1px solid #1a252f;
          overflow-y: auto;
        }

        .sidebar.visible {
          transform: translateX(0);
        }

        .section-title {
          margin: 15px 20px 8px 20px;
          font-size: 0.7rem;
        }

        .menu-item {
          padding: 10px 18px;
          font-size: 0.9rem;
        }

        .menu-item i {
          width: 18px;
          font-size: 0.95rem;
        }
      }

      @media (max-width: 480px) {
        .sidebar {
          width: min(92vw, 320px);
        }

        .sidebar-header {
          padding: 20px 15px;
        }

        .sidebar-header h2 {
          font-size: 1.1rem;
        }

        .logo i {
          font-size: 1.5rem;
        }

        .menu-item {
          padding: 8px 15px;
          font-size: 0.85rem;
        }
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }

      ::-webkit-scrollbar-thumb {
        background: #5dade2;
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #3498db;
      }
    `,
  ],
})
export class SidebarComponent {
  isOpen = true;
  user: User | null = null;
  private collapsedSections = new Set<string>([
    'configuracion',
    'personas',
    'academico',
    'asistencia',
    'eventos',
    'matriculas',
    'sistema',
    'notificaciones',
  ]);

  constructor(private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
  }

  toggleSection(section: string): void {
    if (this.collapsedSections.has(section)) {
      this.collapsedSections.delete(section);
    } else {
      this.collapsedSections.add(section);
    }
  }

  isSectionCollapsed(section: string): boolean {
    return this.collapsedSections.has(section);
  }
}
