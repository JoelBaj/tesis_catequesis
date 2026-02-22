import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Student } from '@app/models/persons.model';
import { StudentsService } from '@app/services/modules/persons.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GridSharedComponent,
  ],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Catequizandos</h1>

      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="students"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="globalFilterFields"
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
    `,
  ],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;

  columns: GridColumn[] = [
    { field: 'person.nombres', header: 'Nombres', width: '11%' },
    { field: 'person.apellidos', header: 'Apellidos', width: '11%' },
    { field: 'person.cedula', header: 'Cédula', width: '10%' },
    { field: 'email', header: 'Email', width: '10%' },
    { field: 'edad', header: 'Edad', width: '7%' },
    { field: 'estado', header: 'Estado', width: '7%' },
    { field: 'necesidadEspecial', header: 'Necesidad Especial', width: '10%' },
    { field: 'representativeNombres', header: 'Rep. Nombres', width: '8%' },
    { field: 'representativeApellidos', header: 'Rep. Apellidos', width: '8%' },
    { field: 'representativeCedula', header: 'Rep. Cédula', width: '8%' },
    { field: 'padresCasados', header: 'Padres Casados', width: '5%' },
    { field: 'padresBodaCivil', header: 'Boda Civil', width: '5%' },
    { field: 'bautizo', header: 'Bautizo', width: '4%' },
  ];

  globalFilterFields = [
    'person.nombres',
    'person.apellidos',
    'person.cedula',
    'email',
    'edad',
    'estado',
    'necesidadEspecial',
    'representativeNombres',
    'representativeApellidos',
    'representativeCedula',
    'padresCasados',
    'padresBodaCivil',
    'bautizo',
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    protected studentsService: StudentsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    // Detectar cuando estamos en una ruta hija
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.isFormRoute = this.route.children.length > 0;
        });
      });
    // Verificar estado inicial
    setTimeout(() => {
      this.isFormRoute = this.route.children.length > 0;
    });
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadStudents(page);
  }

  loadStudents(page: number = 1): void {
    this.isLoading = true;
    this.studentsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response: any) => {
        this.students = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los estudiantes');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(student: Student): void {
    this.router.navigate(['edit', student.id], { relativeTo: this.route });
  }

  onDelete(student: Student): void {
    this.studentsService.delete(student.id).subscribe({
      next: () => {
        this.toastService.success('Estudiante eliminado correctamente');
        this.loadStudents(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar el estudiante');
      },
    });
  }

  onRefresh(): void {
    this.loadStudents(this.currentPage);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
