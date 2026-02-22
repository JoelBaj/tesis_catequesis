import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Course } from '@app/models/academic.model';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '@app/services/modules/academic.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    GridSharedComponent,
  ],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Cursos</h1>

      <!-- Filtro por periodo eliminado -->

      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="courses"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['grupo', 'paralelo', 'aula', 'periodo']"
        (add)="onAdd()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      ></app-grid-shared>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0 0 16px 0;
      }

      .filter-container {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      .filter-input {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        width: 200px;
      }

    `,
  ],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;
  columns: GridColumn[] = [
    { field: 'grupo', header: 'Grupo', width: '15%' },
    { field: 'paralelo', header: 'Paralelo', width: '15%' },
    { field: 'aula', header: 'Aula', width: '20%' },
    { field: 'cupo', header: 'Cupo', width: '15%' },
    { field: 'estado', header: 'Estado', width: '15%' },
    { field: 'periodo', header: 'Periodo', width: '20%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private coursesService: CoursesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
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
    this.loadCourses(page);
  }

  loadCourses(page: number = 1): void {
    this.isLoading = true;
    this.coursesService.getAll(page, this.pageSize, this.currentSearch, undefined, undefined, '').subscribe({
      next: (response) => {
        this.courses = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los cursos');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(course: Course): void {
    this.router.navigate(['edit', course.id], { relativeTo: this.route });
  }

  onDelete(course: Course): void {
    this.coursesService.delete(course.id).subscribe({
      next: () => {
        this.toastService.success('Curso eliminado correctamente');
        this.loadCourses(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar el curso');
      },
    });
  }

  onRefresh(): void {
    this.loadCourses(this.currentPage);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
