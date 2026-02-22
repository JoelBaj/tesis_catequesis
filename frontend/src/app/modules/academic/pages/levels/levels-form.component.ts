import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelsService } from '@app/services/modules/academic.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { Level } from '@app/models/academic.model';
import { ParameterType } from '@app/models/configuration.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-levels-form',
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
        <h1>{{ isEditing ? 'Editar Nivel' : 'Nuevo Nivel' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="levelForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Materia *</label>
            <input
              pInputText
              formControlName="materia"
              placeholder="Ingrese la materia"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('materia')">
              {{ getFieldError('materia') }}
            </small>
          </div>

          <div class="form-group">
            <label>Sacramento *</label>
            <p-dropdown
              [options]="sacramentoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="sacramento"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('sacramento')">
              {{ getFieldError('sacramento') }}
            </small>
          </div>

          <div class="form-group">
            <label>Prerequisito ID</label>
            <p-dropdown
              [options]="prerequisitoOptions"
              optionLabel="label"
              optionValue="value"
              formControlName="prerequisitoId"
              placeholder="Seleccione..."
              [showClear]="true"
              class="w-full"
            ></p-dropdown>
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
            [disabled]="!levelForm.valid || isSaving"
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
export class LevelsFormComponent implements OnInit {
  levelForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentLevelId: string | null = null;

  sacramentoOptions: Array<{ label: string; value: string }> = [];
  prerequisitoOptions: Array<{ label: string; value: number }> = [];

  estadoOptions = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  constructor(
    private fb: FormBuilder,
    private levelsService: LevelsService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.levelForm = this.fb.group({
      materia: ['', [Validators.required]],
      sacramento: ['', [Validators.required]],
      prerequisitoId: [null],
      estado: ['A', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadSacramentos();
    this.loadPrerequisitos();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentLevelId = params['id'];
        this.isEditing = true;
        this.loadLevel();
      }
    });
  }

  private loadSacramentos(): void {
    this.parameterTypesService.getByType('Sacramentos').subscribe({
      next: (items: ParameterType[]) => {
        this.sacramentoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.descripcion,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar sacramentos');
      },
    });
  }

  private loadPrerequisitos(): void {
    this.levelsService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const levels = response.data || [];
        this.prerequisitoOptions = levels
          .map((level: Level) => ({
            label: `${level.materia} - ${level.sacramento}`,
            value: Number(level.id),
          }))
          .filter((option: { label: string; value: number }) => !Number.isNaN(option.value));
        this.filterPrerequisitos();
      },
      error: () => {
        this.toastService.error('Error al cargar prerequisitos');
      },
    });
  }

  loadLevel(): void {
    if (!this.currentLevelId) return;
    this.levelsService.getById(this.currentLevelId).subscribe({
      next: (level: Level) => {
        this.levelForm.patchValue({
          materia: level.materia,
          sacramento: level.sacramento,
          prerequisitoId: level.prerequisitoId,
          estado: level.estado,
        });
        this.filterPrerequisitos();
      },
      error: () => {
        this.toastService.error('Error al cargar el nivel');
        this.onGoBack();
      },
    });
  }

  private filterPrerequisitos(): void {
    if (!this.currentLevelId) return;
    const currentId = Number(this.currentLevelId);
    if (Number.isNaN(currentId)) return;
    this.prerequisitoOptions = this.prerequisitoOptions.filter(
      (option) => option.value !== currentId,
    );
  }

  onSubmit(): void {
    if (!this.levelForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = { ...this.levelForm.value };

    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentLevelId) {
      this.levelsService.update(this.currentLevelId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Nivel actualizado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el nivel');
        },
      });
    } else {
      this.levelsService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Nivel creado correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el nivel');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/levels');
  }

  getFieldError(fieldName: string): string {
    const field = this.levelForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }
}
