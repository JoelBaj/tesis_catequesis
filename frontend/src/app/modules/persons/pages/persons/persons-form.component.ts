import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonsService } from '@app/services/modules/persons.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { Person } from '@app/models/persons.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-persons-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
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
        <h1>{{ isEditing ? 'Editar Persona' : 'Nueva Persona' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="personForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombres *</label>
            <input
              pInputText
              formControlName="nombres"
              placeholder="Ingrese los nombres"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('nombres')">
              {{ getFieldError('nombres') }}
            </small>
          </div>

          <div class="form-group">
            <label>Domicilio</label>
            <input
              pInputText
              formControlName="domicilio"
              placeholder="Ingrese el domicilio"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Apellidos *</label>
            <input
              pInputText
              formControlName="apellidos"
              placeholder="Ingrese los apellidos"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('apellidos')">
              {{ getFieldError('apellidos') }}
            </small>
          </div>

          <div class="form-group">
            <label>Correo</label>
            <input
              pInputText
              formControlName="correo"
              type="email"
              placeholder="Ingrese el correo"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Cédula *</label>
            <input
              pInputText
              formControlName="cedula"
              placeholder="Ingrese el número de cédula"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('cedula')">
              {{ getFieldError('cedula') }}
            </small>
          </div>

          <div class="form-group">
            <label>Localidad de nacimiento</label>
            <input
              pInputText
              formControlName="localidadNacimiento"
              placeholder="Ingrese la localidad"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Fecha de nacimiento</label>
            <p-calendar
              formControlName="fechaNacimiento"
              [showIcon]="true"
              placeholder="dd/mm/aaaa"
              class="w-full"
            ></p-calendar>
          </div>

          <div class="form-group">
            <label>Sexo *</label>
            <p-dropdown
              [options]="genderOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="sexo"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('sexo')">
              {{ getFieldError('sexo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Ciudad de nacimiento</label>
            <p-dropdown
              [options]="cityOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="ciudadNacimiento"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Nacionalidad</label>
            <p-dropdown
              [options]="nationalityOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="nacionalidad"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
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
            [disabled]="!personForm.valid || isSaving"
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

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        color: #333;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .form-group input {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.3s ease;
      }

      .form-group input:focus {
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
        .p-calendar,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
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
          padding: 20px;
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
export class PersonsFormComponent implements OnInit {
  personForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentPersonId: string | null = null;

  genderOptions = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ];

  cityOptions: Array<{ label: string; value: string }> = [];
  nationalityOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private fb: FormBuilder,
    private personsService: PersonsService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.personForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      fechaNacimiento: [''],
      sexo: ['', [Validators.required]],
      correo: [''],
      domicilio: [''],
      ciudadNacimiento: [''],
      localidadNacimiento: [''],
      nacionalidad: [''],
    });
  }

  ngOnInit(): void {
    this.loadParameterOptions();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentPersonId = params['id'];
        this.isEditing = true;
        this.loadPerson();
      }
    });
  }

  private loadParameterOptions(): void {
    this.parameterTypesService.getByType('Cantones').subscribe({
      next: (items) => {
        this.cityOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.descripcion,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar ciudades');
      },
    });

    this.parameterTypesService.getByType('Nacionalidad').subscribe({
      next: (items) => {
        this.nationalityOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.descripcion,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar nacionalidades');
      },
    });
  }

  loadPerson(): void {
    if (!this.currentPersonId) return;
    this.personsService.getById(this.currentPersonId).subscribe({
      next: (person: Person) => {
        this.personForm.patchValue({
          nombres: person.nombres,
          apellidos: person.apellidos,
          cedula: person.cedula,
          fechaNacimiento: person.fechaNacimiento,
          sexo: person.sexo,
          correo: person.correo,
          domicilio: person.domicilio,
          ciudadNacimiento: person.ciudadNacimiento,
          localidadNacimiento: person.localidadNacimiento,
          nacionalidad: person.nacionalidad,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar la persona');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.personForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = { ...this.personForm.value };

    // Convertir fecha al formato que espera el backend
    if (data.fechaNacimiento) {
      const date = new Date(data.fechaNacimiento);
      if (!isNaN(date.getTime())) {
        // Formato ISO date string: YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        data.fechaNacimiento = `${year}-${month}-${day}`;
      } else {
        delete data.fechaNacimiento;
      }
    }

    // Eliminar campos vacíos opcionales
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentPersonId) {
      this.personsService.update(this.currentPersonId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Persona actualizada correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar la persona');
        },
      });
    } else {
      this.personsService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Persona creada correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear la persona');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/persons');
  }

  getFieldError(fieldName: string): string {
    const field = this.personForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }
}
