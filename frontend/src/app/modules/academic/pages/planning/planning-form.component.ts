import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService, LevelsService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { Planning, Level } from '@app/models/academic.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
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
        <h1>{{ isEditing ? 'Editar Planificación' : 'Nueva Planificación' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="planningForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group full-width">
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

          <div class="form-group">
            <label>Objetivo General</label>
            <input
              pInputText
              formControlName="objetivoGeneral"
              placeholder="Ingrese el objetivo general"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Objetivo Específico</label>
            <input
              pInputText
              formControlName="objetivoEspecifico"
              placeholder="Ingrese el objetivo específico"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Metodología</label>
            <input
              pInputText
              formControlName="metodologia"
              placeholder="Ingrese la metodología"
              class="w-full"
            />
          </div>

          <div class="form-group">
            <label>Duración</label>
            <input
              pInputText
              formControlName="tiempo"
              placeholder="Ingrese el tiempo"
              class="w-full"
            />
          </div>

          <div class="form-group full-width">
            <label>Recursos</label>
            <input
              pInputText
              formControlName="recursos"
              placeholder="Ingrese los recursos"
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
            [disabled]="!planningForm.valid || isSaving"
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
        .p-dropdown,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext {
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
export class PlanningFormComponent implements OnInit {
  planningForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentPlanningId: string | null = null;

  levelOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private fb: FormBuilder,
    private planningService: PlanningService,
    private levelsService: LevelsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.planningForm = this.fb.group({
      nivelId: [null, [Validators.required]],
      tema: ['', [Validators.required]],
      objetivoGeneral: [''],
      objetivoEspecifico: [''],
      metodologia: [''],
      tiempo: [''],
      recursos: [''],
    });
  }

  ngOnInit(): void {
    this.loadLevels();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentPlanningId = params['id'];
        this.isEditing = true;
        this.loadPlanning();
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

  loadPlanning(): void {
    if (!this.currentPlanningId) return;
    this.planningService.getById(this.currentPlanningId).subscribe({
      next: (planning: Planning) => {
        this.planningForm.patchValue({
          nivelId: planning.nivelId,
          tema: planning.tema,
          objetivoGeneral: planning.objetivoGeneral,
          objetivoEspecifico: planning.objetivoEspecifico,
          metodologia: planning.metodologia,
          tiempo: planning.tiempo,
          recursos: planning.recursos,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar la planificación');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.planningForm.valid) {
      this.toastService.error('Por favor complete los campos requeridos');
      return;
    }

    this.isSaving = true;
    const data = { ...this.planningForm.value };

    Object.keys(data).forEach((key) => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (this.isEditing && this.currentPlanningId) {
      this.planningService.update(this.currentPlanningId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Planificación actualizada correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar la planificación');
        },
      });
    } else {
      this.planningService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Planificación creada correctamente');
          this.onGoBack();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear la planificación');
        },
      });
    }
  }

  onGoBack(): void {
    this.router.navigateByUrl('/dashboard/planning');
  }

  getFieldError(fieldName: string): string {
    const field = this.planningForm.get(fieldName);
    if (field?.invalid && (field?.dirty || field?.touched)) {
      if (field?.hasError('required')) {
        return 'Este campo es requerido';
      }
    }
    return '';
  }
}
