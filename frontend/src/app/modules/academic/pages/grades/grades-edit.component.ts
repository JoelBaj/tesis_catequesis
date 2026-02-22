import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GradesService } from '@app/services/modules/academic.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { Grade } from '@app/models/academic.model';

@Component({
  selector: 'app-grades-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    TooltipModule,
    InputNumberModule,
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
        <h1>Editar Calificacion</h1>
        <div></div>
      </div>

      <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="form-content" *ngIf="editForm && grade">
        <div class="form-grid">
          <div class="form-group">
            <label>Catequizando</label>
            <input pInputText [value]="getStudentName()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Cedula</label>
            <input pInputText [value]="getStudentCedula()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Curso</label>
            <input pInputText [value]="getCourseInfo()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Periodo <span class="required">*</span></label>
            <p-dropdown
              [options]="periodoOptions"
              formControlName="periodo"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un periodo..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('periodo')">
              {{ getFieldError('periodo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Parcial <span class="required">*</span></label>
            <p-dropdown
              [options]="parcialOptions"
              formControlName="parcial"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un parcial..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('parcial')">
              {{ getFieldError('parcial') }}
            </small>
          </div>

          <div class="form-group">
            <label>Tareas</label>
            <p-inputNumber
              formControlName="tareas"
              [useGrouping]="false"
              [min]="0"
              [max]="10"
              [maxFractionDigits]="2"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group">
            <label>Lecciones</label>
            <p-inputNumber
              formControlName="lecciones"
              [useGrouping]="false"
              [min]="0"
              [max]="10"
              [maxFractionDigits]="2"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group">
            <label>Evaluacion Oral</label>
            <p-inputNumber
              formControlName="evaluacionOral"
              [useGrouping]="false"
              [min]="0"
              [max]="10"
              [maxFractionDigits]="2"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group">
            <label>Evaluacion Escrita</label>
            <p-inputNumber
              formControlName="evaluacionEscrita"
              [useGrouping]="false"
              [min]="0"
              [max]="10"
              [maxFractionDigits]="2"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group">
            <label>Cualitativa <span class="required">*</span></label>
            <p-dropdown
              [options]="notaOptions"
              formControlName="cualitativa"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('cualitativa')">
              {{ getFieldError('cualitativa') }}
            </small>
          </div>

          <div class="form-group">
            <label>Cuantitativa</label>
            <p-inputNumber
              formControlName="cuantitativa"
              [useGrouping]="false"
              [min]="0"
              [max]="10"
              [maxFractionDigits]="2"
              [readonly]="true"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group full-width">
            <label>Observaciones</label>
            <textarea
              pInputTextarea
              formControlName="observaciones"
              placeholder="Ingrese observaciones"
              rows="4"
              class="w-full"
            ></textarea>
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
            label="Actualizar"
            class="p-button-success"
            [disabled]="!editForm.valid || isSaving"
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
        max-width: 900px;
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

      .error {
        color: #d32f2f;
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

      .w-full {
        width: 100%;
      }

      :host ::ng-deep {
        .p-dropdown,
        .p-inputtext,
        .p-inputtextarea,
        .p-inputnumber {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-inputtext,
        .p-inputnumber input {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
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
export class GradesEditComponent implements OnInit {
  editForm!: FormGroup;
  isSaving = false;
  gradeId: number | null = null;
  grade: Grade | null = null;
  notaOptions: Array<{ label: string; value: string }> = [];
  periodoOptions: Array<{ label: string; value: string }> = [];
  parcialOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private fb: FormBuilder,
    private gradesService: GradesService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      periodo: ['', [Validators.required]],
      parcial: ['', [Validators.required]],
      tareas: [null],
      lecciones: [null],
      evaluacionOral: [null],
      evaluacionEscrita: [null],
      cualitativa: ['', [Validators.required]],
      cuantitativa: [null],
      observaciones: [''],
    });

    this.watchScoreChanges();

    this.loadNotaOptions();
    this.loadPeriodoOptions();
    this.loadParcialOptions();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gradeId = parseInt(id);
      this.loadGrade();
    }
  }

  loadNotaOptions(): void {
    this.parameterTypesService.getByType('Nota').subscribe({
      next: (items) => {
        this.notaOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar opciones de nota');
      },
    });
  }

  loadPeriodoOptions(): void {
    this.parameterTypesService.getByType('Periodo').subscribe({
      next: (items) => {
        this.periodoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar periodos');
      },
    });
  }

  loadParcialOptions(): void {
    this.parameterTypesService.getByType('Parcial').subscribe({
      next: (items) => {
        this.parcialOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar parciales');
      },
    });
  }

  loadGrade(): void {
    if (!this.gradeId) return;

    this.gradesService.getById(this.gradeId).subscribe({
      next: (grade: Grade) => {
        this.grade = grade;
        this.editForm.patchValue({
          periodo: grade.periodo,
          parcial: grade.parcial,
          tareas: grade.tareas ?? null,
          lecciones: grade.lecciones ?? null,
          evaluacionOral: grade.evaluacionOral ?? null,
          evaluacionEscrita: grade.evaluacionEscrita ?? null,
          cualitativa: grade.cualitativa,
          cuantitativa: grade.cuantitativa ?? null,
          observaciones: grade.observaciones || '',
        });

        this.updateCuantitativa();
      },
      error: () => {
        this.toastService.error('Error al cargar la calificacion');
        this.onGoBack();
      },
    });
  }

  watchScoreChanges(): void {
    ['tareas', 'lecciones', 'evaluacionOral', 'evaluacionEscrita'].forEach((field) => {
      this.editForm.get(field)?.valueChanges.subscribe(() => this.updateCuantitativa());
    });
  }

  updateCuantitativa(): void {
    const values = [
      this.editForm.get('tareas')?.value,
      this.editForm.get('lecciones')?.value,
      this.editForm.get('evaluacionOral')?.value,
      this.editForm.get('evaluacionEscrita')?.value,
    ].filter((value) => typeof value === 'number' && !isNaN(value)) as number[];

    if (values.length === 0) {
      this.editForm.get('cuantitativa')?.setValue(null, { emitEvent: false });
      return;
    }

    const sum = values.reduce((total, value) => total + value, 0);
    const avg = Number((sum / values.length).toFixed(2));
    this.editForm.get('cuantitativa')?.setValue(avg, { emitEvent: false });
  }

  getStudentName(): string {
    if (this.grade?.student?.person) {
      return `${this.grade.student.person.nombres} ${this.grade.student.person.apellidos}`;
    }
    return 'N/A';
  }

  getStudentCedula(): string {
    return this.grade?.student?.person?.cedula || 'N/A';
  }

  getCourseInfo(): string {
    if (this.grade?.course) {
      const group = this.grade.course.grupo || '';
      const parallel = this.grade.course.paralelo || '';
      return `${group} ${parallel}`.trim() || 'N/A';
    }
    return 'N/A';
  }

  onSubmit(): void {
    if (!this.editForm.valid || !this.gradeId) return;

    this.isSaving = true;
    const data = this.editForm.value;

    this.gradesService.update(this.gradeId, data).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Calificacion actualizada exitosamente');
        this.onGoBack();
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Error al actualizar la calificacion');
      },
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/grades']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.editForm?.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return 'Este campo es requerido';
    }
    return null;
  }
}
