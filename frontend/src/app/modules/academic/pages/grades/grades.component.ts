import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GradesService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Grade } from '@app/models/academic.model';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Calificaciones</h1>
        <app-grid-shared
          [columns]="columns"
          [rows]="grades"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
          [globalFilterFields]="['periodo', 'parcial', 'cualitativa', 'student.person.nombres', 'student.person.cedula']"
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
  styles: [
    `
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
    `,
  ],
})
export class GradesComponent implements OnInit {
  grades: Grade[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;

  columns: GridColumn[] = [
    { field: 'student.person.nombres', header: 'Catequizando', width: '25%' },
    { field: 'student.person.cedula', header: 'Cedula', width: '15%' },
    { field: 'course.grupo', header: 'Grupo', width: '10%' },
    { field: 'course.paralelo', header: 'Paralelo', width: '10%' },
    { field: 'periodo', header: 'Periodo', width: '10%' },
    { field: 'parcial', header: 'Parcial', width: '10%' },
    { field: 'cualitativa', header: 'Cualitativa', width: '15%' },
    { field: 'cuantitativa', header: 'Cuantitativa', width: '15%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private gradesService: GradesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadGrades();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadGrades(this.currentPage);
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
    this.loadGrades(page);
  }

  loadGrades(page: number = 1): void {
    this.isLoading = true;
    this.gradesService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.grades = response.data || [];
        this.totalRecords = response.total || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar calificaciones');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(grade: Grade): void {
    this.router.navigate(['edit-single', grade.id], { relativeTo: this.route });
  }

  onDelete(grade: Grade): void {
    this.gradesService.delete(grade.id).subscribe({
      next: () => {
        this.toastService.success('Eliminado');
        this.loadGrades(this.currentPage);
      },
      error: () => this.toastService.error('Error al eliminar'),
    });
  }

  onRefresh(): void {
    this.loadGrades(1);
  }

  onExport(): void {
    this.toastService.info('En desarrollo');
  }
}
