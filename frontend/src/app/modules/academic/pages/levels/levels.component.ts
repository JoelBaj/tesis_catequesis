import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LevelsService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Level } from '@app/models/academic.model';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Niveles</h1>
      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="levels"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['materia', 'sacramento', 'estado']"
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
export class LevelsComponent implements OnInit {
  levels: Level[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;

  columns: GridColumn[] = [
    { field: 'materia', header: 'Materia', width: '30%' },
    { field: 'sacramento', header: 'Sacramento', width: '30%' },
    { field: 'estado', header: 'Estado', width: '20%' },
    { field: 'prerequisitoId', header: 'Prerequisito ID', width: '20%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private levelsService: LevelsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadLevels();
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
    this.loadLevels(page);
  }
  loadLevels(page: number = 1): void {
    this.isLoading = true;
    this.levelsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.levels = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar niveles');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(level: Level): void {
    this.router.navigate(['edit', level.id], { relativeTo: this.route });
  }
  onDelete(level: Level): void { this.levelsService.delete(level.id).subscribe({ next: () => { this.toastService.success('Nivel eliminado'); this.loadLevels(this.currentPage); }, error: () => this.toastService.error('Error') }); }
  onRefresh(): void { this.loadLevels(this.currentPage); }
  onExport(): void { this.toastService.info('En desarrollo'); }
}
