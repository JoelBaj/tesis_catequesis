import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { EnrollmentsService } from '@app/services/modules/enrollment.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { InputSearchComponent } from '@app/shared/components/input-search/input-search.component';
import { Enrollment } from '@app/models/enrollment.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GridSharedComponent,
    InputSearchComponent,
    InputTextModule,
    ButtonModule,
    RouterOutlet,
  ],
  template: `
    <div class="list-container" *ngIf="!hasChildRoute">
      <h1>Matrículas</h1>
      <app-grid-shared
        [columns]="columns"
        [rows]="enrollments"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        (add)="onAdd()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      >
      </app-grid-shared>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .list-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
      }
    `,
  ],
})
export class EnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;

  columns: GridColumn[] = [
    { field: 'student.person.nombres', header: 'Estudiante', width: '30%' },
    { field: 'student.person.cedula', header: 'Cédula', width: '20%' },
    { field: 'course.grupo', header: 'Grupo', width: '15%' },
    { field: 'course.paralelo', header: 'Paralelo', width: '15%' },
    { field: 'fecha', header: 'Fecha', width: '20%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private fb: FormBuilder,
    private enrollmentsService: EnrollmentsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
    this.detectChildRoute();
  }

  detectChildRoute(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hasChildRoute =
          this.router.url.includes('/add') || this.router.url.includes('/edit');
        if (!this.hasChildRoute) {
          this.loadEnrollments(this.currentPage);
        }
      });
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadEnrollments(page);
  }

  loadEnrollments(page: number = 1): void {
    this.isLoading = true;
    console.log('Buscando matrículas con search:', this.currentSearch, 'página:', page);
    this.enrollmentsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        console.log('Respuesta enrollments:', response);
        this.enrollments = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.isLoading = false;
        this.toastService.error(
          err?.error?.message || 'Error al cargar matrículas'
        );
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(enrollment: Enrollment): void {
    this.router.navigate(['edit', enrollment.id], { relativeTo: this.route });
  }

  onDelete(enrollment: Enrollment): void {
    if (confirm('¿Está seguro de que desea eliminar esta matrícula?')) {
      this.enrollmentsService.delete(enrollment.id).subscribe({
        next: () => {
          this.toastService.success('Matrícula eliminada exitosamente');
          this.loadEnrollments(this.currentPage);
        },
        error: (err) => {
          console.error('Error deleting:', err);
          this.toastService.error(
            err?.error?.message || 'Error al eliminar matrícula'
          );
        },
      });
    }
  }

  onRefresh(): void {
    this.loadEnrollments(1);
  }

  onExport(): void {
    this.toastService.info('Funcionalidad en desarrollo');
  }
}
