import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { ParameterType } from '@app/models/configuration.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parameter-types-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    InputNumberModule,
    TooltipModule,
    DropdownModule,
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
        <h1>{{ isEditing ? 'Editar Tipo de Parámetro' : 'Nuevo Tipo de Parámetro' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="parameterTypeForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Tipo *</label>
            <p-dropdown
              [options]="tipoOptions"
              formControlName="tipos"
              placeholder="Seleccione el tipo"
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('tipos')">
              {{ getFieldError('tipos') }}
            </small>
          </div>

          <div class="form-group">
            <label>Código *</label>
            <input
              pInputText
              formControlName="codigo"
              placeholder="Ingrese el código"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('codigo')">
              {{ getFieldError('codigo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Cupo</label>
            <p-inputNumber
              formControlName="cupo"
              [useGrouping]="false"
              placeholder="0"
            />
          </div>

          <div class="form-group full-width">
            <label>Descripción *</label>
            <input
              pInputText
              formControlName="descripcion"
              placeholder="Ingrese la descripción"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('descripcion')">
              {{ getFieldError('descripcion') }}
            </small>
          </div>

          <div class="form-group checkbox-group">
            <label>GCP</label>
            <p-checkbox 
              formControlName="gcp" 
              [binary]="true" 
              label="Habilitado"
            ></p-checkbox>
          </div>

          <div class="form-group checkbox-group">
            <label>GSM</label>
            <p-checkbox 
              formControlName="gsm" 
              [binary]="true" 
              label="Habilitado"
            ></p-checkbox>
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
            label="{{ isEditing ? 'Actualizar' : 'Guardar' }}" 
            class="p-button-success"
            [disabled]="!parameterTypeForm.valid || isSaving"
            [loading]="isSaving"
          ></button>
        </div>
      </form>
    </div>
  `,
  styles: [`
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

    .form-group input {
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

    .form-group.checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .form-group.checkbox-group label {
      margin: 0;
      min-width: 80px;
    }

    .form-group.checkbox-group p-checkbox {
      flex: 1;
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
      .p-dropdown {
        width: 100%;
      }

      .p-dropdown .p-inputtext {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        font-size: 0.95rem;
      }

      .p-dropdown:not(.p-disabled).p-focus .p-inputtext,
      .p-dropdown:not(.p-disabled):hover .p-inputtext {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .p-inputnumber {
        width: 100%;
      }

      .p-inputnumber input {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        font-size: 0.95rem;
      }

      .p-inputnumber input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }

      .p-checkbox .p-checkbox-box {
        border-color: #d0d0d0;
        border-radius: 4px;
        width: 20px;
        height: 20px;
      }

      .p-checkbox .p-checkbox-box.p-highlight {
        background-color: #28a745;
        border-color: #28a745;
      }

      .p-button-text.p-button-secondary:hover {
        background-color: #f5f5f5;
      }

      .p-button {
        font-weight: 600;
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
  `],
})
export class ParameterTypesFormComponent implements OnInit {
  parameterTypeForm: FormGroup;
  isEditing = false;
  isSaving = false;
  currentParameterTypeId: string | null = null;
  tipoOptions: string[] = [
    'Sacramentos',
    'Cantones',
    'Nacionalidad',
    'Cargo Ministro',
    'Parroquias',
    'Provincias',
    'Motivos de Misa',
    'Horarios de Misa',
    'Aula',
    'Periodo',
    'Parcial',
    'Clase',
    'Asistencia',
    'Catequista',
    'AsistenciaEncuentro',
    'EstadoEvento',
    'Evento',
    'Nota',
    'BAND',
  ];

  constructor(
    private fb: FormBuilder,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.parameterTypeForm = this.fb.group({
      tipos: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      gcp: [false],
      gsm: [false],
      cupo: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentParameterTypeId = params['id'];
        this.isEditing = true;
        this.loadParameterType();
      }
    });
  }

  loadParameterType(): void {
    if (!this.currentParameterTypeId) return;

    this.parameterTypesService.getById(this.currentParameterTypeId).subscribe({
      next: (parameterType: ParameterType) => {
        this.parameterTypeForm.patchValue({
          tipos: parameterType.tipos,
          codigo: parameterType.codigo,
          descripcion: parameterType.descripcion,
          gcp: parameterType.gcp ? true : false,
          gsm: parameterType.gsm ? true : false,
          cupo: parameterType.cupo,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el tipo de parámetro');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.parameterTypeForm.valid) {
      this.toastService.error('Por favor complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;
    const formData = this.parameterTypeForm.value;
    const data = {
      ...formData,
      gcp: formData.gcp ? 1 : 0,
      gsm: formData.gsm ? 1 : 0,
    };

    if (this.isEditing && this.currentParameterTypeId) {
      this.parameterTypesService.update(this.currentParameterTypeId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Tipo de parámetro actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el tipo de parámetro');
        },
      });
    } else {
      this.parameterTypesService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Tipo de parámetro creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el tipo de parámetro');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/parameter-types']);
  }

  getFieldError(fieldName: string): string {
    const field = this.parameterTypeForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    return '';
  }
}
