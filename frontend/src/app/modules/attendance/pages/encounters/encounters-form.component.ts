import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncountersService } from '@app/services/modules/attendance.service';
import { CoursesService } from '@app/services/modules/academic.service';
import { CatechistsService } from '@app/services/modules/persons.service';
import { ToastService } from '@app/services/toast.service';
import { Encounter } from '@app/models/attendance.model';
import { Course } from '@app/models/academic.model';
import { Catechist } from '@app/models/persons.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-encounters-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    InputMaskModule,
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
        <h1>{{ isEditing ? 'Editar Encuentro' : 'Nuevo Encuentro' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="encounterForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Curso *</label>
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
            <label>Fecha *</label>
            <p-calendar
              formControlName="fecha"
              [showIcon]="true"
              placeholder="yyyy-mm-dd"
              dateFormat="yy-mm-dd"
              class="w-full"
            ></p-calendar>
            <small class="error" *ngIf="getFieldError('fecha')">
              {{ getFieldError('fecha') }}
            </small>
          </div>

          <div class="form-group">
            <label>Hora *</label>
            <p-inputMask
              formControlName="horario"
              mask="99:99"
              placeholder="hh:mm"
              class="w-full"
            ></p-inputMask>
            <small class="error" *ngIf="getFieldError('horario')">
              {{ getFieldError('horario') }}
            </small>
          </div>

          <div class="form-group full-width">
            <label>Tema *</label>
            <input
              pInputText
              formControlName="tema"
              placeholder="Ingrese el tema"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('tema')">
              {{ getFieldError('tema') }}
            </small>
          </div>

          <div class="form-group full-width">
            <label>Actividades</label>
            <textarea
              pInputText
              formControlName="actividades"
              placeholder="Ingrese las actividades"
              rows="3"
              class="w-full"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label>Observación del Catequista</label>
            <textarea
              pInputText
              formControlName="observacionCatequista"
              placeholder="Ingrese observaciones"
              rows="3"
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
            [label]="isEditing ? 'Actualizar' : 'Agregar'"
            class="p-button-success"
            [disabled]="!encounterForm.valid || isSaving"
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

      .form-group.full-width {
        grid-column: 1 / -1;
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
        .p-inputtext,
        .p-calendar {
          width: 100%;
        }

        .p-inputtext,
        .p-calendar .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
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
export class EncountersFormComponent implements OnInit {
  encounterForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentEncounterId: string | null = null;

  courseOptions: Array<{ label: string; value: number }> = [];
  catechistOptions: Array<{ label: string; value: number }> = [];

  constructor(
    private fb: FormBuilder,
    private encountersService: EncountersService,
    private coursesService: CoursesService,
    private catechistsService: CatechistsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.encounterForm = this.fb.group({
      cursoId: [null, [Validators.required]],
      catequistaId: [null, [Validators.required]],
      fecha: ['', [Validators.required]],
      horario: ['', [Validators.required]],
      tema: ['', [Validators.required]],
      actividades: [''],
      observacionCatequista: [''],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadCatechists();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentEncounterId = params['id'];
        this.isEditing = true;
        this.loadEncounter();
      }
    });
  }

  private loadCourses(): void {
    this.coursesService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const courses = response.data || [];
        this.courseOptions = courses.map((course: Course) => ({
          label: `${course.grupo || ''} ${course.paralelo || ''} - ${course.periodo || ''}`.trim(),
          value: Number(course.id),
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar cursos');
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
          value: Number(catechist.id),
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar catequistas');
      },
    });
  }

  loadEncounter(): void {
    if (!this.currentEncounterId) return;
    this.encountersService.getById(this.currentEncounterId).subscribe({
      next: (encounter: Encounter) => {
        const fechaValue = encounter.fecha ? new Date(encounter.fecha) : '';
        this.encounterForm.patchValue({
          cursoId: encounter.cursoId,
          catequistaId: encounter.catequistaId,
          fecha: fechaValue,
          horario: encounter.horario,
          tema: encounter.tema,
          actividades: encounter.actividades,
          observacionCatequista: encounter.observacionCatequista,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el encuentro');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.encounterForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = { ...this.encounterForm.value };

    if (data.fecha) {
      const date = new Date(data.fecha);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        data.fecha = `${year}-${month}-${day}`;
      } else {
        delete data.fecha;
      }
    }

    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentEncounterId) {
      this.encountersService.update(this.currentEncounterId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Encuentro actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el encuentro');
        },
      });
    } else {
      this.encountersService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Encuentro creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el encuentro');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/encounters');
  }

  getFieldError(fieldName: string): string {
    const field = this.encounterForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }
}
