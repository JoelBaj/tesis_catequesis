import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '@app/services/modules/events.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { Event } from '@app/models/events.model';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    ButtonModule,
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
        <h1>{{ isEditMode ? 'Editar Evento' : 'Registrar Evento' }}</h1>
        <div></div>
      </div>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre <span class="required">*</span></label>
            <input
              pInputText
              formControlName="nombre"
              placeholder="Ingrese el nombre del evento"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('nombre')">
              {{ getFieldError('nombre') }}
            </small>
          </div>

          <div class="form-group">
            <label>Tipo de Evento <span class="required">*</span></label>
            <p-dropdown
              [options]="tipoEventoOptions"
              formControlName="tipoevento"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('tipoevento')">
              {{ getFieldError('tipoevento') }}
            </small>
          </div>

          <div class="form-group">
            <label>Fecha <span class="required">*</span></label>
            <p-calendar
              formControlName="fecha"
              [showIcon]="true"
              placeholder="Seleccione la fecha"
              class="w-full"
            ></p-calendar>
            <small class="error" *ngIf="getFieldError('fecha')">
              {{ getFieldError('fecha') }}
            </small>
          </div>

          <div class="form-group">
            <label>Estado <span class="required">*</span></label>
            <p-dropdown
              [options]="estadoOptions"
              formControlName="estado"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('estado')">
              {{ getFieldError('estado') }}
            </small>
          </div>

          <div class="form-group">
            <label>Ubicacion <span class="required">*</span></label>
            <input
              pInputText
              formControlName="lugar"
              placeholder="Ingrese la ubicacion"
              class="w-full"
            />
            <small class="error" *ngIf="getFieldError('lugar')">
              {{ getFieldError('lugar') }}
            </small>
          </div>

          <div class="form-group full-width">
            <label>Descripcion</label>
            <textarea
              pInputTextarea
              formControlName="descripcion"
              placeholder="Ingrese la descripcion"
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
            label="{{ isEditMode ? 'Actualizar' : 'Guardar' }}"
            class="p-button-success"
            [disabled]="!eventForm.valid || isSaving"
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
        .p-calendar,
        .p-inputtext,
        .p-inputtextarea {
          width: 100%;
        }

        .p-calendar .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-dropdown .p-inputtext {
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
export class EventsFormComponent implements OnInit {
  eventForm!: FormGroup;
  isSaving = false;
  isEditMode = false;
  eventId: number | null = null;
  estadoOptions: Array<{ label: string; value: string }> = [];
  tipoEventoOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nombre: ['', [Validators.required]],
      tipoevento: ['', [Validators.required]],
      fecha: [null, [Validators.required]],
      estado: ['', [Validators.required]],
      lugar: ['', [Validators.required]],
      descripcion: [''],
    });

    this.loadEstadoOptions();
    this.loadTipoEventoOptions();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = parseInt(id);
      this.loadEvent();
    }
  }

  loadEstadoOptions(): void {
    this.parameterTypesService.getByType('EstadoEvento').subscribe({
      next: (items) => {
        this.estadoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar estados del evento');
      },
    });
  }

  loadTipoEventoOptions(): void {
    this.parameterTypesService.getByType('Evento').subscribe({
      next: (items) => {
        this.tipoEventoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar tipos de evento');
      },
    });
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.eventsService.getById(this.eventId).subscribe({
      next: (event: Event) => {
        this.eventForm.patchValue({
          nombre: event.nombre,
          tipoevento: event.tipoevento,
          fecha: event.fecha,
          estado: event.estado,
          lugar: event.lugar || '',
          descripcion: event.descripcion || '',
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el evento');
        this.onGoBack();
      },
    });
  }

  onSubmit(): void {
    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const data = this.eventForm.value;

    if (this.isEditMode && this.eventId) {
      this.eventsService.update(this.eventId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Evento actualizado');
          this.onGoBack();
        },
        error: (err) => {
          this.isSaving = false;
          this.toastService.error(err?.message || 'Error al actualizar el evento');
        },
      });
      return;
    }

    this.eventsService.create(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Evento creado');
        this.onGoBack();
      },
      error: (err) => {
        this.isSaving = false;
        this.toastService.error(err?.message || 'Error al crear el evento');
      },
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/events']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.eventForm?.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return 'Este campo es requerido';
    }
    return null;
  }
}
