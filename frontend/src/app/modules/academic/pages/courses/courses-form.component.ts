import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService, LevelsService } from '@app/services/modules/academic.service';
import { CatechistsService } from '@app/services/modules/persons.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { Course, Level } from '@app/models/academic.model';
import { Catechist } from '@app/models/persons.model';
import { ParameterType } from '@app/models/configuration.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-courses-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    TooltipModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button
          pButton
          type="button"
          icon="pi pi-arrow-left"
          class="p-button-text p-button-secondary"
          (click)="onGoBack()"
          pTooltip="Volver"
          tooltipPosition="right"
        ></button>
        <h1>{{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Nivel *</label>
            <p-dropdown
              [options]="levelOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="nivelId"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('nivelId')">
              {{ getFieldError('nivelId') }}
            </small>
          </div>

          <div class="form-group">
            <label>Catequista *</label>
            <p-dropdown
              [options]="catechistOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="catequistaId"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('catequistaId')">
              {{ getFieldError('catequistaId') }}
            </small>
          </div>

          <div class="form-group">
            <label>Catequista Auxiliar</label>
            <p-dropdown
              [options]="catechistOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="catequistaAuxiliarId"
              placeholder="Seleccione..."
              [showClear]="true"
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Catequista Suplente</label>
            <p-dropdown
              [options]="catechistOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="catequistaSupleteId"
              placeholder="Seleccione..."
              [showClear]="true"
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Grupo</label>
            <p-dropdown
              [options]="grupoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="grupo"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Paralelo</label>
            <p-dropdown
              [options]="paraleloOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="paralelo"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Aula *</label>
            <p-dropdown
              [options]="aulaOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="aula"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('aula')">
              {{ getFieldError('aula') }}
            </small>
          </div>

          <div class="form-group">
            <label>Cupo *</label>
            <p-inputNumber formControlName="cupo" placeholder="Ingrese el cupo" class="w-full"></p-inputNumber>
            <small class="error" *ngIf="getFieldError('cupo')">
              {{ getFieldError('cupo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Estado *</label>
            <p-dropdown
              [options]="estadoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="estado"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('estado')">
              {{ getFieldError('estado') }}
            </small>
          </div>

          <div class="form-group">
            <label>Tipo de Curso</label>
            <p-dropdown
              [options]="claseOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="tipoCurso"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Periodo *</label>
            <p-dropdown
              [options]="periodoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="periodo"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('periodo')">
              {{ getFieldError('periodo') }}
            </small>
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
            [disabled]="!courseForm.valid || isSaving"
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

      .form-group label {
        color: #333;
        font-weight: 600;
        font-size: 0.95rem;
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

      :host ::ng-deep {
        .p-dropdown,
        .p-inputnumber,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-inputnumber .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-inputnumber-input {
          height: 44px;
          padding: 12px 14px;
        }
      }

      @media (max-width: 480px) {
        .form-header {
          padding: 15px 15px;
        }

        .form-header h1 {
          font-size: 1.4rem;
        }

        .form-content {
          padding: 20px 15px;
        }

        .form-grid {
          gap: 18px;
        }

        .form-footer {
          padding: 15px;
          gap: 8px;
        }

        .form-footer button {
          flex: 1;
          min-width: auto;
        }
      }
    `,
  ],
})
export class CoursesFormComponent implements OnInit {
  courseForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentCourseId: string | null = null;

  levelOptions: Array<{ label: string; value: string }> = [];
  catechistOptions: Array<{ label: string; value: string }> = [];
  grupoOptions: Array<{ label: string; value: string }> = [];
  paraleloOptions: Array<{ label: string; value: string }> = [];
  aulaOptions: Array<{ label: string; value: string }> = [];
  periodoOptions: Array<{ label: string; value: string }> = [];
  claseOptions: Array<{ label: string; value: string }> = [];
  estadoOptions = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private levelsService: LevelsService,
    private catechistsService: CatechistsService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.courseForm = this.fb.group({
      nivelId: [null, [Validators.required]],
      grupo: [''],
      paralelo: [''],
      catequistaId: [null, [Validators.required]],
      catequistaAuxiliarId: [null],
      catequistaSupleteId: [null],
      estado: ['A', [Validators.required]],
      aula: ['', [Validators.required]],
      cupo: [0, [Validators.required]],
      tipoCurso: [''],
      periodo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadLevels();
    this.loadCatechists();
    this.loadParameterOptions();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentCourseId = params['id'];
        this.isEditing = true;
        this.loadCourse();
      }
    });
  }

  private loadParameterOptions(): void {
    this.loadParameterType('Grupo', (options) => (this.grupoOptions = options));
    this.loadParameterType('Paralelo', (options) => (this.paraleloOptions = options));
    this.loadParameterType('Aula', (options) => (this.aulaOptions = options));
    this.loadParameterType('Periodo', (options) => (this.periodoOptions = options));
    this.loadParameterType('Clase', (options) => (this.claseOptions = options));
  }

  private loadParameterType(
    type: string,
    setter: (options: Array<{ label: string; value: string }>) => void,
  ): void {
    this.parameterTypesService.getByType(type).subscribe({
      next: (items: ParameterType[]) => {
        const options = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.descripcion,
        }));
        setter(options);
      },
      error: () => {
        this.toastService.error(`Error al cargar ${type.toLowerCase()}`);
      },
    });
  }

  private loadLevels(): void {
    this.levelsService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const levels = response.data || [];
        this.levelOptions = levels.map((level: Level) => ({
          label: `${level.materia} - ${level.sacramento}`,
          value: level.id,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar niveles');
      },
    });
  }

  private loadCatechists(): void {
    this.catechistsService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const catechists = response.data || [];
        this.catechistOptions = catechists.map((catechist: Catechist) => ({
          label: catechist.person
            ? `${catechist.person.nombres} ${catechist.person.apellidos} - ${catechist.person.cedula}`
            : `Catequista #${catechist.id}`,
          value: catechist.id,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar catequistas');
      },
    });
  }

  loadCourse(): void {
    if (!this.currentCourseId) return;
    this.coursesService.getById(this.currentCourseId).subscribe({
      next: (course: Course) => {
        this.courseForm.patchValue({
          nivelId: course.nivelId,
          grupo: course.grupo,
          paralelo: course.paralelo,
          catequistaId: course.catequistaId,
          catequistaAuxiliarId: course.catequistaAuxiliarId,
          catequistaSupleteId: course.catequistaSupleteId,
          estado: course.estado,
          aula: course.aula,
          cupo: course.cupo,
          tipoCurso: course.tipoCurso,
          periodo: course.periodo,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el curso');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.courseForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = { ...this.courseForm.value };

    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentCourseId) {
      this.coursesService.update(this.currentCourseId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Curso actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el curso');
        },
      });
    } else {
      this.coursesService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Curso creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el curso');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/courses');
  }

  getFieldError(fieldName: string): string {
    const field = this.courseForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }
}
