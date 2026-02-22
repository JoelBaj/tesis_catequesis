import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService, PersonsService } from '@app/services/modules/persons.service';
import { ToastService } from '@app/services/toast.service';
import { Student, Person } from '@app/models/persons.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-students-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
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
          class="p-button-text p-button-secondary"
          (click)="onGoBack()"
          pTooltip="Volver"
          tooltipPosition="right"
        ></button>
        <h1>{{ isEditing ? 'Editar Catequizando' : 'Nuevo Catequizando' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <!-- Búsqueda de Feligrés -->
          <div class="form-group full-width">
            <label>Feligrés *</label>
            <p-autoComplete
              [(ngModel)]="selectedPerson"
              [ngModelOptions]="{standalone: true}"
              [suggestions]="filteredPersons"
              (completeMethod)="searchPersons($event)"
              field="displayName"
              [dropdown]="true"
              [forceSelection]="true"
              placeholder="Buscar por cédula, nombre o apellido..."
              (onSelect)="onSelectPerson($event)"
              (onUnselect)="onClearPerson()"
              (onClear)="onClearPerson()"
              [disabled]="isEditing"
              class="w-full"
            >
              <ng-template let-person pTemplate="item">
                <div class="person-item">
                  <div>{{ person.nombres }} {{ person.apellidos }}</div>
                  <small>{{ person.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
            <small class="info" *ngIf="selectedPerson">
              Seleccionado: {{ selectedPerson.nombres }} {{ selectedPerson.apellidos }} - {{ selectedPerson.cedula }}
            </small>
            <small class="error" *ngIf="getFieldError('feligresId')">
              {{ getFieldError('feligresId') }}
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
            <label>Edad *</label>
            <p-inputNumber
              formControlName="edad"
              placeholder="Ingrese la edad"
              [showButtons]="true"
              [min]="0"
              [max]="99"
              class="w-full"
            ></p-inputNumber>
            <small class="error" *ngIf="getFieldError('edad')">
              {{ getFieldError('edad') }}
            </small>
          </div>

          <div class="form-group">
            <label>Necesidad Especial *</label>
            <p-dropdown
              [options]="siNoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="necesidadEspecial"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('necesidadEspecial')">
              {{ getFieldError('necesidadEspecial') }}
            </small>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              pInputText
              formControlName="email"
              type="email"
              placeholder="Ingrese el email"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Padre</label>
            <p-autoComplete
              [(ngModel)]="selectedFather"
              [ngModelOptions]="{standalone: true}"
              [suggestions]="filteredFathers"
              (completeMethod)="searchFathers($event)"
              field="displayName"
              [dropdown]="true"
              placeholder="Buscar padre..."
              (onSelect)="onSelectFather($event)"
              (onClear)="onClearFather()"
              class="w-full"
            >
              <ng-template let-person pTemplate="item">
                <div class="person-item">
                  <div>{{ person.nombres }} {{ person.apellidos }}</div>
                  <small>{{ person.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
          </div>

          <div class="form-group">
            <label>Madre</label>
            <p-autoComplete
              [(ngModel)]="selectedMother"
              [ngModelOptions]="{standalone: true}"
              [suggestions]="filteredMothers"
              (completeMethod)="searchMothers($event)"
              field="displayName"
              [dropdown]="true"
              placeholder="Buscar madre..."
              (onSelect)="onSelectMother($event)"
              (onClear)="onClearMother()"
              class="w-full"
            >
              <ng-template let-person pTemplate="item">
                <div class="person-item">
                  <div>{{ person.nombres }} {{ person.apellidos }}</div>
                  <small>{{ person.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
          </div>

          <div class="form-group">
            <label>Representante</label>
            <p-autoComplete
              [(ngModel)]="selectedRepresentative"
              [ngModelOptions]="{standalone: true}"
              [suggestions]="filteredRepresentatives"
              (completeMethod)="searchRepresentatives($event)"
              field="displayName"
              [dropdown]="true"
              placeholder="Buscar representante..."
              (onSelect)="onSelectRepresentative($event)"
              (onClear)="onClearRepresentative()"
              class="w-full"
            >
              <ng-template let-person pTemplate="item">
                <div class="person-item">
                  <div>{{ person.nombres }} {{ person.apellidos }}</div>
                  <small>{{ person.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
          </div>

          <div class="form-group">
            <label>Padres Casados</label>
            <p-dropdown
              [options]="siNoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="padresCasados"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Padres Boda Civil</label>
            <p-dropdown
              [options]="siNoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="padresBodaCivil"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Año Bautizo</label>
            <p-inputNumber
              formControlName="bautizo"
              placeholder="Año de bautizo"
              [useGrouping]="false"
              [min]="1900"
              [max]="2100"
              class="w-full"
            ></p-inputNumber>
          </div>

          <div class="form-group full-width">
            <label>Observaciones</label>
            <textarea
              pInputText
              formControlName="observacion"
              placeholder="Ingrese observaciones adicionales"
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
            [disabled]="!studentForm.valid || isSaving"
            [loading]="isSaving"
          ></button>
          <!-- Debug temporal -->
          <small style="color: red; margin-top: 10px;" *ngIf="!studentForm.valid">
            Formulario inválido: {{ getFormValidationErrors() }}
          </small>
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

      :host ::ng-deep {
        .p-dropdown,
        .p-autocomplete,
        .p-inputnumber,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-autocomplete .p-inputtext,
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
export class StudentsFormComponent implements OnInit {
  studentForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentStudentId: string | null = null;

  selectedPerson: Person | null = null;
  selectedFather: Person | null = null;
  selectedMother: Person | null = null;
  selectedRepresentative: Person | null = null;
  
  filteredPersons: any[] = [];
  filteredFathers: any[] = [];
  filteredMothers: any[] = [];
  filteredRepresentatives: any[] = [];

  estadoOptions = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  siNoOptions = [
    { label: 'Sí', value: 'S' },
    { label: 'No', value: 'N' },
  ];

  constructor(
    private fb: FormBuilder,
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.studentForm = this.fb.group({
      feligresId: [null, [Validators.required]],
      estado: ['A', [Validators.required]],
      necesidadEspecial: ['N', [Validators.required]],
      edad: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      email: [''],
      observacion: [''],
      padreId: [null],
      madreId: [null],
      representanteId: [null],
      padresCasados: [''],
      padresBodaCivil: [''],
      bautizo: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentStudentId = params['id'];
        this.isEditing = true;
        this.loadStudent();
      }
    });
  }

  searchPersons(event: any): void {
    const query = event.query || '';
    this.personsService.getAll(1, 20, query).subscribe({
      next: (response: any) => {
        this.filteredPersons = (response.data || []).map((p: Person) => ({
          ...p,
          displayName: `${p.nombres} ${p.apellidos} - ${p.cedula}`,
        }));
      },
      error: () => {
        this.toastService.error('Error al buscar personas');
      },
    });
  }

  searchFathers(event: any): void {
    const query = event.query || '';
    this.personsService.getAll(1, 20, query).subscribe({
      next: (response: any) => {
        this.filteredFathers = (response.data || []).map((p: Person) => ({
          ...p,
          displayName: `${p.nombres} ${p.apellidos} - ${p.cedula}`,
        }));
      },
    });
  }

  searchMothers(event: any): void {
    const query = event.query || '';
    this.personsService.getAll(1, 20, query).subscribe({
      next: (response: any) => {
        this.filteredMothers = (response.data || []).map((p: Person) => ({
          ...p,
          displayName: `${p.nombres} ${p.apellidos} - ${p.cedula}`,
        }));
      },
    });
  }

  searchRepresentatives(event: any): void {
    const query = event.query || '';
    this.personsService.getAll(1, 20, query).subscribe({
      next: (response: any) => {
        this.filteredRepresentatives = (response.data || []).map((p: Person) => ({
          ...p,
          displayName: `${p.nombres} ${p.apellidos} - ${p.cedula}`,
        }));
      },
    });
  }

  onSelectPerson(event: any): void {
    const person = event.value || event;
    
    if (person && person.id) {
      const feligresIdControl = this.studentForm.get('feligresId');
      if (feligresIdControl) {
        feligresIdControl.setValue(person.id);
        feligresIdControl.markAsTouched();
        feligresIdControl.markAsDirty();
        feligresIdControl.updateValueAndValidity();
      }
    }
  }

  onClearPerson(): void {
    this.selectedPerson = null;
    const feligresIdControl = this.studentForm.get('feligresId');
    if (feligresIdControl) {
      feligresIdControl.setValue(null);
      feligresIdControl.markAsTouched();
    }
  }

  onSelectFather(event: any): void {
    const person = event.value || event;
    if (person && person.id) {
      this.studentForm.patchValue({ padreId: person.id });
    }
  }

  onClearFather(): void {
    this.selectedFather = null;
    this.studentForm.patchValue({ padreId: null });
  }

  onSelectMother(event: any): void {
    const person = event.value || event;
    if (person && person.id) {
      this.studentForm.patchValue({ madreId: person.id });
    }
  }

  onClearMother(): void {
    this.selectedMother = null;
    this.studentForm.patchValue({ madreId: null });
  }

  onSelectRepresentative(event: any): void {
    const person = event.value || event;
    if (person && person.id) {
      this.studentForm.patchValue({ representanteId: person.id });
    }
  }

  onClearRepresentative(): void {
    this.selectedRepresentative = null;
    this.studentForm.patchValue({ representanteId: null });
  }

  loadStudent(): void {
    if (!this.currentStudentId) return;
    this.studentsService.getById(this.currentStudentId).subscribe({
      next: (student: Student) => {
        if (student.person) {
          this.selectedPerson = {
            ...student.person,
            displayName: `${student.person.nombres} ${student.person.apellidos} - ${student.person.cedula}`
          } as any;
        }
        
        // Cargar padre si existe
        if (student.padreId) {
          this.personsService.getById(student.padreId.toString()).subscribe({
            next: (padre: Person) => {
              this.selectedFather = {
                ...padre,
                displayName: `${padre.nombres} ${padre.apellidos} - ${padre.cedula}`
              } as any;
            },
            error: () => {
              console.error('Error al cargar datos del padre');
            }
          });
        }

        // Cargar madre si existe
        if (student.madreId) {
          this.personsService.getById(student.madreId.toString()).subscribe({
            next: (madre: Person) => {
              this.selectedMother = {
                ...madre,
                displayName: `${madre.nombres} ${madre.apellidos} - ${madre.cedula}`
              } as any;
            },
            error: () => {
              console.error('Error al cargar datos de la madre');
            }
          });
        }

        // Cargar representante si existe
        if (student.representanteId) {
          this.personsService.getById(student.representanteId.toString()).subscribe({
            next: (representante: Person) => {
              this.selectedRepresentative = {
                ...representante,
                displayName: `${representante.nombres} ${representante.apellidos} - ${representante.cedula}`
              } as any;
            },
            error: () => {
              console.error('Error al cargar datos del representante');
            }
          });
        }
        
        this.studentForm.patchValue({
          feligresId: student.feligresId,
          estado: student.estado,
          necesidadEspecial: student.necesidadEspecial,
          edad: student.edad,
          email: student.email,
          observacion: student.observacion,
          padreId: student.padreId,
          madreId: student.madreId,
          representanteId: student.representanteId,
          padresCasados: student.padresCasados,
          padresBodaCivil: student.padresBodaCivil,
          bautizo: student.bautizo,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el estudiante');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.studentForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = {
      feligresId: this.studentForm.value.feligresId,
      estado: this.studentForm.value.estado,
      necesidadEspecial: this.studentForm.value.necesidadEspecial,
      edad: this.studentForm.value.edad,
      email: this.studentForm.value.email,
      observacion: this.studentForm.value.observacion,
      padreId: this.studentForm.value.padreId,
      madreId: this.studentForm.value.madreId,
      representanteId: this.studentForm.value.representanteId,
      padresCasados: this.studentForm.value.padresCasados,
      padresBodaCivil: this.studentForm.value.padresBodaCivil,
      bautizo: this.studentForm.value.bautizo,
    };

    // Eliminar campos vacíos opcionales
    Object.keys(data).forEach((key) => {
      if (data[key as keyof typeof data] === '' || data[key as keyof typeof data] === null) {
        delete data[key as keyof typeof data];
      }
    });

    if (this.isEditing && this.currentStudentId) {
      this.studentsService.update(this.currentStudentId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Catequizando actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el catequizando');
        },
      });
    } else {
      this.studentsService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Catequizando creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el catequizando');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/students');
  }

  getFieldError(fieldName: string): string {
    const field = this.studentForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }

  getFormValidationErrors(): string {
    const errors: string[] = [];
    Object.keys(this.studentForm.controls).forEach(key => {
      const controlErrors = this.studentForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          errors.push(`${key}: ${keyError}`);
        });
      }
    });
    return errors.join(', ') || 'Sin errores detectados';
  }
}
