import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PlanningService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Planning } from '@app/models/academic.model';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Planificación</h1>
      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="plannings"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['tema', 'metodologia', 'level.materia']"
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
export class PlanningComponent implements OnInit {
  plannings: Planning[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;

  columns: GridColumn[] = [
    { field: 'tema', header: 'Tema', width: '20%' },
    { field: 'objetivoGeneral', header: 'Objetivo General', width: '20%' },
    { field: 'metodologia', header: 'Metodología', width: '20%' },
    { field: 'tiempo', header: 'Tiempo', width: '15%' },
    { field: 'level.materia', header: 'Nivel', width: '25%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private planningService: PlanningService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadPlannings();
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
    this.loadPlannings(page);
  }
  loadPlannings(page: number = 1): void {
    this.isLoading = true;
    this.planningService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.plannings = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar planificaciones');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(planning: Planning): void {
    this.router.navigate(['edit', planning.id], { relativeTo: this.route });
  }
  onDelete(planning: Planning): void { this.planningService.delete(planning.id).subscribe({ next: () => { this.toastService.success('Eliminado'); this.loadPlannings(this.currentPage); }, error: () => this.toastService.error('Error') }); }
  onRefresh(): void { this.loadPlannings(this.currentPage); }
  onExport(): void { this.toastService.info('En desarrollo'); }
}
