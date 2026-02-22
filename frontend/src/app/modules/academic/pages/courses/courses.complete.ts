import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Course } from '@app/models/academic.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CoursesService } from '@app/services/modules/academic.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GridSharedComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
  ],
  template: `
    <div class="page-container">
      <h1>Cursos</h1>

      <app-grid-shared
        [columns]="columns"
        [rows]="courses"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['grupo', 'paralelo', 'periodo', 'tipoCurso']"
        (add)="onOpenForm()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      ></app-grid-shared>

      <p-dialog [visible]="isFormOpen" [modal]="true" [header]="formTitle" [style]="{ width: formWidth }" (onHide)="onCloseForm()">
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          <div class="form-row-2">
            <div class="form-group">
              <label>Grupo</label>
              <input pInputText formControlName="grupo" placeholder="Ingrese el grupo" class="w-full" />
            </div>
            <div class="form-group">
              <label>Paralelo</label>
              <input pInputText formControlName="paralelo" placeholder="Ingrese el paralelo" class="w-full" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Periodo</label>
              <input pInputText formControlName="periodo" placeholder="Ingrese el periodo" class="w-full" />
            </div>
            <div class="form-group">
              <label>Tipo de Curso</label>
              <input pInputText formControlName="tipoCurso" placeholder="Ingrese el tipo" class="w-full" />
            </div>
          </div>

          <div class="form-group">
            <label>Cupo</label>
            <p-inputNumber formControlName="cupo" placeholder="Ingrese el cupo" class="w-full"></p-inputNumber>
          </div>

          <div class="dialog-footer">
            <button pButton type="button" label="Cancelar" class="p-button-secondary" (click)="onCloseForm()"></button>
            <button pButton type="submit" label="Guardar" class="p-button-success" [disabled]="!courseForm.valid || isSaving" [loading]="isSaving"></button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
      }

      .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
      }

      .form-group input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormOpen = false;
  isSaving = false;
  isEditing = false;
  currentCourseId: string | null = null;

  courseForm: FormGroup;
  columns: GridColumn[] = [
    { field: 'grupo', header: 'Grupo', width: '20%' },
    { field: 'paralelo', header: 'Paralelo', width: '20%' },
    { field: 'periodo', header: 'Periodo', width: '20%' },
    { field: 'tipoCurso', header: 'Tipo', width: '20%' },
    { field: 'cupo', header: 'Cupo', width: '20%' },
  ];

  formTitle = 'Nuevo Curso';
  formWidth = '600px';
  currentPage = 1;
  currentSearch = '';

  constructor(
    private fb: FormBuilder,
    private academicService: CoursesService,
    private toastService: ToastService,
  ) {
    this.courseForm = this.fb.group({
      grupo: [''],
      paralelo: [''],
      periodo: ['', [Validators.required]],
      tipoCurso: [''],
      cupo: [0, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event.globalFilter ?? '').toString();
    this.loadCourses(page);
  }

  loadCourses(page: number = 1): void {
    this.isLoading = true;
    this.academicService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response: any) => {
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

  onOpenForm(): void {
    this.isEditing = false;
    this.currentCourseId = null;
    this.formTitle = 'Nuevo Curso';
    this.courseForm.reset();
    this.isFormOpen = true;
  }

  onEdit(course: Course): void {
    this.isEditing = true;
    this.currentCourseId = course.id;
    this.formTitle = 'Editar Curso';
    this.courseForm.patchValue({
      grupo: course.grupo,
      paralelo: course.paralelo,
      periodo: course.periodo,
      tipoCurso: course.tipoCurso,
      cupo: course.cupo,
    });
    this.isFormOpen = true;
  }

  onCloseForm(): void {
    this.isFormOpen = false;
    this.courseForm.reset();
  }

  onSubmit(): void {
    if (!this.courseForm.valid) return;
    this.isSaving = true;
    const data = this.courseForm.value;

    if (this.isEditing && this.currentCourseId) {
      this.academicService.update(this.currentCourseId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Curso actualizado correctamente');
          this.isFormOpen = false;
          this.loadCourses(this.currentPage);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el curso');
        },
      });
    } else {
      this.academicService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Curso creado correctamente');
          this.isFormOpen = false;
          this.loadCourses(1);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el curso');
        },
      });
    }
  }

  onDelete(course: Course): void {
    this.academicService.delete(course.id).subscribe({
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
    this.loadCourses(1);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
