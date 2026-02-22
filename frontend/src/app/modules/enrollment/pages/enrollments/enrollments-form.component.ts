import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentsService } from '@app/services/modules/enrollment.service';
import { ToastService } from '@app/services/toast.service';
import { StudentsService } from '@app/services/modules/persons.service';
import { CoursesService } from '@app/services/modules/academic.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Enrollment } from '@app/models/enrollment.model';
import { Student } from '@app/models/persons.model';
import { Course } from '@app/models/academic.model';

@Component({
  selector: 'app-enrollments-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    CalendarModule,
    AutoCompleteModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button
          pButton
          type="button"
          icon="pi pi-arrow-left"
          class="p-button-text p-button-secondary header-back-btn"
          (click)="onGoBack()"
          pTooltip="Volver"
          tooltipPosition="right"
        ></button>
        <h1>{{ isEditing ? 'Editar Matrícula' : 'Nueva Matrícula' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Estudiante <span class="required">*</span></label>
            <p-autoComplete
              [(ngModel)]="selectedStudent"
              [ngModelOptions]="{standalone: true}"
              [suggestions]="filteredStudents"
              (completeMethod)="searchStudents($event)"
              field="displayName"
              [dropdown]="true"
              [forceSelection]="true"
              placeholder="Buscar por cédula, nombre o apellido..."
              (onSelect)="onSelectStudent($event)"
              (onUnselect)="onClearStudent()"
              (onClear)="onClearStudent()"
              [disabled]="isEditing"
              class="w-full"
            >
              <ng-template let-student pTemplate="item">
                <div class="person-item">
                  <div>{{ student.person?.nombres }} {{ student.person?.apellidos }}</div>
                  <small>{{ student.person?.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
            <small class="info" *ngIf="selectedStudent">
              Seleccionado: {{ selectedStudent.person?.nombres }} {{ selectedStudent.person?.apellidos }} - {{ selectedStudent.person?.cedula }}
            </small>
            <small class="error" *ngIf="getFieldError('catequizandoId')">
              {{ getFieldError('catequizandoId') }}
            </small>
          </div>

          <div class="form-group">
            <label>Curso <span class="required">*</span></label>
            <p-dropdown
              [options]="courseOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="cursoId"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('cursoId')">
              {{ getFieldError('cursoId') }}
            </small>
          </div>

          <div class="form-group">
            <label>Fecha de Matrícula <span class="required">*</span></label>
            <p-calendar
              formControlName="fecha"
              [showIcon]="true"
              placeholder="Seleccione la fecha"
              class="w-full"
              dateFormat="dd/mm/yy"
            ></p-calendar>
            <small class="error" *ngIf="getFieldError('fecha')">
              {{ getFieldError('fecha') }}
            </small>
          </div>

          <div class="form-group">
            <label>Observación</label>
            <input
              pInputText
              formControlName="observacion"
              placeholder="Ingrese observación"
              class="w-full"
            />
          </div>
        </div>

        <div class="form-footer">
          <button
            pButton
            type="button"
            label="Regresar"
            class="p-button-secondary"
            (click)="onGoBack()"
          ></button>
          <button
            pButton
            type="submit"
            [label]="isEditing ? 'Actualizar' : 'Agregar'"
            class="p-button-success"
            [disabled]="!enrollmentForm.valid || isSaving"
            [loading]="isSaving"
          ></button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }

      .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 30px;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        gap: 20px;
        flex-shrink: 0;
      }

      .form-header h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
        flex: 1;
        text-align: center;
      }

      .form-header > div:first-child,
      .form-header > div:last-child {
        width: 50px;
        display: flex;
        justify-content: center;
      }

      .header-back-btn {
        background: transparent !important;
        border-color: transparent !important;
        color: #6b7280 !important;
      }

      .header-back-btn .p-button-icon {
        color: #6b7280 !important;
      }

      .form-content {
        flex: 1;
        overflow-y: auto;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        max-width: 800px;
        width: 100%;
        padding: 0;
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        color: #333;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .required {
        color: #ef4444;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.3s ease;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .error {
        color: #d32f2f;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .info {
        color: #1976d2;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .form-footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 20px 30px;
        background: white;
        border-top: 1px solid #e0e0e0;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        width: 100%;
        max-width: 1200px;
      }

      .form-footer button {
        min-width: 130px;
        padding: 10px 20px;
      }

      .person-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .person-item small {
        color: #666;
      }

      .w-full {
        width: 100%;
      }

      :host ::ng-deep {
        .p-dropdown,
        .p-autocomplete,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-autocomplete .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-calendar .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-dropdown-panel,
        .p-autocomplete-panel {
          min-width: 250px !important;
        }

        .p-button {
          border-radius: 6px;
        }

        .p-button-secondary {
          background-color: #6b7280;
          border-color: #6b7280;
        }

        .p-button-success {
          background-color: #10b981;
          border-color: #10b981;
        }
      }
    `,
  ],
})
export class EnrollmentsFormComponent implements OnInit {
  enrollmentForm: FormGroup;
  isEditing = false;
  isSaving = false;
  currentEnrollmentId: number | null = null;

  selectedStudent: Student | null = null;
  filteredStudents: Student[] = [];
  courseOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private enrollmentsService: EnrollmentsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.enrollmentForm = this.fb.group({
      catequizandoId: [null, [Validators.required]],
      cursoId: [null, [Validators.required]],
      fecha: ['', [Validators.required]],
      observacion: [''],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentEnrollmentId = parseInt(id);
      this.loadEnrollment();
    }
  }

  private loadCourses(): void {
    this.coursesService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const courses = response.data || [];
        this.courseOptions = courses.map((course: Course) => ({
          label: `${course.grupo} - ${course.paralelo}${course.aula ? ' (' + course.aula + ')' : ''}`,
          value: course.id,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar cursos');
      },
    });
  }

  searchStudents(event: any): void {
    const query = event.query || '';
    this.studentsService.getAll(1, 20, query).subscribe({
      next: (response: any) => {
        this.filteredStudents = (response.data || []).map((s: Student) => ({
          ...s,
          displayName: `${s.person?.nombres} ${s.person?.apellidos} - ${s.person?.cedula}`,
        }));
      },
      error: () => {
        this.toastService.error('Error al buscar estudiantes');
      },
    });
  }

  onSelectStudent(event: any): void {
    const student = event.value || event;
    this.selectedStudent = student;
    this.enrollmentForm.patchValue({
      catequizandoId: student.id,
    });
  }

  onClearStudent(): void {
    this.selectedStudent = null;
    this.enrollmentForm.patchValue({
      catequizandoId: null,
    });
  }

  loadEnrollment(): void {
    if (!this.currentEnrollmentId) return;

    this.enrollmentsService.getById(this.currentEnrollmentId).subscribe({
      next: (enrollment: Enrollment) => {
        this.selectedStudent = enrollment.student as any;
        this.enrollmentForm.patchValue({
          catequizandoId: enrollment.catequizandoId,
          cursoId: enrollment.cursoId,
          fecha: enrollment.fecha,
          observacion: enrollment.observacion,
        });
      },
      error: () => this.toastService.error('Error al cargar la matrícula'),
    });
  }

  onSubmit(): void {
    if (!this.enrollmentForm.valid) return;

    this.isSaving = true;
    let data = { ...this.enrollmentForm.value };

    // Clean empty fields
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === undefined || data[key] === '') {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentEnrollmentId) {
      this.enrollmentsService.update(this.currentEnrollmentId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Matrícula actualizada exitosamente');
          this.onGoBack();
        },
        error: (error: any) => {
          this.isSaving = false;
          this.toastService.error(
            error?.error?.message || 'Error al actualizar la matrícula'
          );
        },
      });
    } else {
      this.enrollmentsService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Matrícula creada exitosamente');
          this.onGoBack();
        },
        error: (error: any) => {
          this.isSaving = false;
          this.toastService.error(
            error?.error?.message || 'Error al crear la matrícula'
          );
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.enrollmentForm.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      catequizandoId: 'El estudiante',
      cursoId: 'El curso',
      fecha: 'La fecha de matrícula',
      observacion: 'La observación',
    };
    return labels[fieldName] || 'El campo';
  }
}
