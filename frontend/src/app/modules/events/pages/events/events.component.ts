import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventsService } from '@app/services/modules/events.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Event } from '@app/models/events.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Eventos</h1>
        <app-grid-shared
          [columns]="columns"
          [rows]="events"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
          [globalFilterFields]="['nombre', 'descripcion', 'lugar']"
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
export class EventsComponent implements OnInit {
  events: Event[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  columns: GridColumn[] = [
    { field: 'nombre', header: 'Nombre', width: '25%' },
    { field: 'fecha', header: 'Fecha', width: '20%' },
    { field: 'lugar', header: 'Ubicación', width: '30%' },
    { field: 'descripcion', header: 'Descripción', width: '25%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private eventsService: EventsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.loadEvents();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadEvents(this.currentPage);
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
    this.loadEvents(page);
  }

  loadEvents(page: number = 1): void {
    this.isLoading = true;
    this.eventsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.events = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.isLoading = false;
        this.toastService.error(err?.message || 'Error al cargar eventos');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(event: Event): void {
    this.router.navigate(['edit', event.id], { relativeTo: this.route });
  }

  onDelete(event: Event): void {
    this.eventsService.delete(event.id).subscribe({
      next: () => {
        this.toastService.success('Evento eliminado');
        this.loadEvents(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting:', err);
        this.toastService.error(err?.message || 'Error al eliminar');
      },
    });
  }

  onRefresh(): void {
    this.loadEvents(1);
  }

  onExport(): void {
    this.toastService.info('Exportación en desarrollo');
  }
}
