import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EncountersService } from '@app/services/modules/attendance.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Encounter } from '@app/models/attendance.model';

@Component({
  selector: 'app-encounters',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Encuentros</h1>
      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="encounters"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['fecha', 'tema', 'horario']"
        (add)="onAdd()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      ></app-grid-shared>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; height: 100%; gap: 0; }
    h1 { color: #333; font-size: 1.8rem; margin: 0 0 16px 0; }
  `],
})
export class EncountersComponent implements OnInit {
  encounters: Encounter[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;

  columns: GridColumn[] = [
    { field: 'fecha', header: 'Fecha', width: '30%' },
    { field: 'horario', header: 'Hora', width: '20%' },
    { field: 'tema', header: 'Tema', width: '50%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private encountersService: EncountersService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadEncounters();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.isFormRoute = this.route.children.length > 0;
        });
      });

    setTimeout(() => {
      this.isFormRoute = this.route.children.length > 0;
    });
  }
  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadEncounters(page);
  }
  loadEncounters(page: number = 1): void {
    this.isLoading = true;
    this.encountersService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.encounters = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar encuentros');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(encounter: Encounter): void {
    this.router.navigate(['edit', encounter.id], { relativeTo: this.route });
  }
  onDelete(encounter: Encounter): void { this.encountersService.delete(encounter.id).subscribe({ next: () => { this.toastService.success('Eliminado'); this.loadEncounters(this.currentPage); }, error: () => this.toastService.error('Error') }); }
  onRefresh(): void { this.loadEncounters(this.currentPage); }
  onExport(): void { this.toastService.info('En desarrollo'); }
}
