import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventAttendancesService } from '@app/services/modules/events.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { EventAttendance } from '@app/models/events.model';

@Component({
  selector: 'app-event-attendances',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Asistencia a Eventos</h1>
        <app-grid-shared
          [columns]="columns"
          [rows]="eventAttendances"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
          [globalFilterFields]="['estado', 'observacion', 'person.nombres', 'event.nombre']"
          (add)="onOpenForm()"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (refresh)="onRefresh()"
          (export)="onExport()"
          (lazyLoad)="onLazyLoad($event)"
        >
        </app-grid-shared>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100%;
    }

    .list-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: 1;
      overflow: hidden;
    }

    h1 {
      color: #333;
      font-size: 1.8rem;
      margin: 0;
    }

  `],
})
export class EventAttendancesComponent implements OnInit {
  eventAttendances: EventAttendance[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;

  columns: GridColumn[] = [
    { field: 'person.nombres', header: 'Persona', width: '35%' },
    { field: 'event.nombre', header: 'Evento', width: '30%' },
    { field: 'estado', header: 'Estado', width: '20%' },
    { field: 'observacion', header: 'Observación', width: '15%' },
  ];
  currentPage = 1;
  currentSearch = '';

  constructor(
    private eventAttendancesService: EventAttendancesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.loadEventAttendances();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadEventAttendances(this.currentPage);
          }
        });
      });

    setTimeout(() => {
      this.hasChildRoute = this.router.url.includes('/add') || this.router.url.includes('/edit');
    });
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadEventAttendances(page);
  }

  loadEventAttendances(page: number = 1): void {
    this.isLoading = true;
    this.eventAttendancesService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        console.log('Event Attendances Response:', response);
        this.eventAttendances = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading event attendances:', err);
        this.isLoading = false;
        this.toastService.error(err?.message || 'Error al cargar asistencias');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(eventAttendance: EventAttendance): void {
    this.router.navigate(['edit-single', eventAttendance.id], { relativeTo: this.route });
  }

  onDelete(eventAttendance: EventAttendance): void {
    this.eventAttendancesService.delete(eventAttendance.id).subscribe({
      next: () => {
        this.toastService.success('Eliminado');
        this.loadEventAttendances(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting:', err);
        this.toastService.error(err?.message || 'Error al eliminar');
      },
    });
  }

  onRefresh(): void {
    this.loadEventAttendances(1);
  }

  onExport(): void {
    this.toastService.info('En desarrollo');
  }
}
