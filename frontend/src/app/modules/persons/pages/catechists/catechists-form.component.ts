import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatechistsService, PersonsService } from '@app/services/modules/persons.service';
import { LevelsService } from '@app/services/modules/academic.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { Catechist, Person } from '@app/models/persons.model';
import { Level } from '@app/models/academic.model';
import { ParameterType } from '@app/models/configuration.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-catechists-form',
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
        <h1>{{ isEditing ? 'Editar Catequista' : 'Nuevo Catequista' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="catechistForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
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
            <label>Años de Apostolado *</label>
            <p-inputNumber
              formControlName="aniosApostolado"
              placeholder="Ingrese los años"
              [showButtons]="true"
              [min]="0"
              class="w-full"
            ></p-inputNumber>
            <small class="error" *ngIf="getFieldError('aniosApostolado')">
              {{ getFieldError('aniosApostolado') }}
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
            <label>Tipo *</label>
            <p-dropdown
              [options]="catechistTypeOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="tipo"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('tipo')">
              {{ getFieldError('tipo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Primer Título</label>
            <p-dropdown
              [options]="titleOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="titulo1"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
          </div>

          <div class="form-group">
            <label>Segundo Título</label>
            <p-dropdown
              [options]="titleOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="titulo2"
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
            [disabled]="!catechistForm.valid || isSaving"
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
export class CatechistsFormComponent implements OnInit {
  catechistForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentCatechistId: string | null = null;

  selectedPerson: Person | null = null;
  filteredPersons: any[] = [];
  levelOptions: Array<{ label: string; value: string }> = [];
  catechistTypeOptions: Array<{ label: string; value: string }> = [];
  titleOptions: Array<{ label: string; value: string }> = [];

  estadoOptions = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  constructor(
    private fb: FormBuilder,
    private catechistsService: CatechistsService,
    private personsService: PersonsService,
    private levelsService: LevelsService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.catechistForm = this.fb.group({
      feligresId: [null, [Validators.required]],
      nivelId: [null, [Validators.required, Validators.min(1)]],
      titulo1: [''],
      titulo2: [''],
      aniosApostolado: [0, [Validators.required, Validators.min(0)]],
      estado: ['A', [Validators.required]],
      tipo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadLevels();
    this.loadCatechistTypes();
    this.loadTitles();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentCatechistId = params['id'];
        this.isEditing = true;
        this.loadCatechist();
      }
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

  private loadCatechistTypes(): void {
    this.parameterTypesService.getByType('Catequista').subscribe({
      next: (items: ParameterType[]) => {
        this.catechistTypeOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.descripcion,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar tipos de catequista');
      },
    });
  }

  private loadTitles(): void {
    this.parameterTypesService.getByType('Titulo').subscribe({
      next: (items: ParameterType[]) => {
        const baseOptions = (items || []).flatMap((item) => {
          const options = [{ label: item.descripcion, value: item.descripcion }];
          if (item.codigo && item.codigo !== item.descripcion) {
            options.push({ label: item.descripcion, value: item.codigo });
          }
          return options;
        });
        this.titleOptions = baseOptions;
        this.applyTitleSelection();
      },
      error: () => {
        this.toastService.error('Error al cargar títulos');
      },
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

  onSelectPerson(event: any): void {
    const person = event.value || event;
    if (person && person.id) {
      const feligresIdControl = this.catechistForm.get('feligresId');
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
    const feligresIdControl = this.catechistForm.get('feligresId');
    if (feligresIdControl) {
      feligresIdControl.setValue(null);
      feligresIdControl.markAsTouched();
    }
  }

  loadCatechist(): void {
    if (!this.currentCatechistId) return;
    this.catechistsService.getById(this.currentCatechistId).subscribe({
      next: (catechist: Catechist) => {
        if (catechist.person) {
          this.selectedPerson = {
            ...catechist.person,
            displayName: `${catechist.person.nombres} ${catechist.person.apellidos} - ${catechist.person.cedula}`,
          } as any;
        }

        this.catechistForm.patchValue({
          feligresId: catechist.feligresId,
          nivelId: catechist.nivelId,
          titulo1: catechist.titulo1,
          titulo2: catechist.titulo2,
          aniosApostolado: catechist.aniosApostolado,
          estado: catechist.estado,
          tipo: catechist.tipo,
        });
        this.applyTitleSelection();
      },
      error: () => {
        this.toastService.error('Error al cargar el catequista');
        this.onGoBack();
      },
    });
  }

  private applyTitleSelection(): void {
    const titulo1 = this.catechistForm.get('titulo1')?.value as string | null | undefined;
    const titulo2 = this.catechistForm.get('titulo2')?.value as string | null | undefined;
    this.ensureTitleOption(titulo1);
    this.ensureTitleOption(titulo2);
  }

  private ensureTitleOption(value: string | null | undefined): void {
    if (!value) return;
    const exists = this.titleOptions.some(
      (option) => option.value === value || option.label === value,
    );
    if (!exists) {
      this.titleOptions = [...this.titleOptions, { label: value, value }];
    }
  }

  onSubmit(): void {
    if (!this.catechistForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = {
      feligresId: this.catechistForm.value.feligresId,
      nivelId: this.catechistForm.value.nivelId,
      titulo1: this.catechistForm.value.titulo1,
      titulo2: this.catechistForm.value.titulo2,
      aniosApostolado: this.catechistForm.value.aniosApostolado,
      estado: this.catechistForm.value.estado,
      tipo: this.catechistForm.value.tipo,
    };

    Object.keys(data).forEach((key) => {
      if (data[key as keyof typeof data] === '' || data[key as keyof typeof data] === null) {
        delete data[key as keyof typeof data];
      }
    });

    if (this.isEditing && this.currentCatechistId) {
      this.catechistsService.update(this.currentCatechistId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Catequista actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el catequista');
        },
      });
    } else {
      this.catechistsService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Catequista creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el catequista');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/catechists');
  }

  getFieldError(fieldName: string): string {
    const field = this.catechistForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
      if (field?.hasError('min')) {
        return 'El valor es inválido';
      }
    }
    return '';
  }
}
