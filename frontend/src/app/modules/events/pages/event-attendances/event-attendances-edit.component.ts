import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventAttendancesService } from '@app/services/modules/events.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EventAttendance } from '@app/models/events.model';

@Component({
  selector: 'app-event-attendances-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    TooltipModule,
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
        <h1>Editar Asistencia a Evento</h1>
        <div></div>
      </div>

      <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="form-content" *ngIf="editForm && attendance">
        <div class="form-grid">
          <div class="form-group">
            <label>Feligres</label>
            <input pInputText [value]="getPersonName()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Cedula</label>
            <input pInputText [value]="getPersonCedula()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Evento</label>
            <input pInputText [value]="getEventName()" disabled class="w-full" />
          </div>

          <div class="form-group">
            <label>Fecha</label>
            <input pInputText [value]="attendance.event?.fecha || 'N/A'" disabled class="w-full" />
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

          <div class="form-group full-width">
            <label>Observacion</label>
            <textarea
              pInputTextarea
              formControlName="observacion"
              placeholder="Ingrese observacion"
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
        .p-dropdown,
        .p-inputtext,
        .p-inputtextarea {
          width: 100%;
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
export class EventAttendancesEditComponent implements OnInit {
  editForm!: FormGroup;
  isSaving = false;
  attendanceId: number | null = null;
  attendance: EventAttendance | null = null;

  estadoOptions = [
    { label: 'Presente', value: 'P' },
    { label: 'Ausente', value: 'A' },
    { label: 'Tardanza', value: 'T' },
    { label: 'Justificado', value: 'J' },
  ];

  constructor(
    private fb: FormBuilder,
    private eventAttendancesService: EventAttendancesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.attendanceId = parseInt(id);
      this.loadAttendance();
    }
  }

  loadAttendance(): void {
    if (!this.attendanceId) return;

    this.eventAttendancesService.getById(this.attendanceId).subscribe({
      next: (attendance: EventAttendance) => {
        this.attendance = attendance;
        this.editForm = this.fb.group({
          estado: [attendance.estado, [Validators.required]],
          observacion: [attendance.observacion || ''],
        });
      },
      error: () => {
        this.toastService.error('Error al cargar la asistencia');
        this.onGoBack();
      },
    });
  }

  getPersonName(): string {
    if (this.attendance?.person) {
      return `${this.attendance.person.nombres} ${this.attendance.person.apellidos}`;
    }
    return 'N/A';
  }

  getPersonCedula(): string {
    return this.attendance?.person?.cedula || 'N/A';
  }

  getEventName(): string {
    return this.attendance?.event?.nombre || 'N/A';
  }

  onSubmit(): void {
    if (!this.editForm.valid || !this.attendanceId) return;

    this.isSaving = true;
    const data = this.editForm.value;

    this.eventAttendancesService.update(this.attendanceId, data).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Asistencia actualizada exitosamente');
        this.onGoBack();
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Error al actualizar la asistencia');
      },
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/event-attendances']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.editForm?.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return 'El estado es requerido';
    }
    return null;
  }
}
