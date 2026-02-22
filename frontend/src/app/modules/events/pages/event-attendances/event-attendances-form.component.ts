import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, EventAttendancesService } from '@app/services/modules/events.service';
import { PersonsService } from '@app/services/modules/persons.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Event } from '@app/models/events.model';
import { Person } from '@app/models/persons.model';

interface PersonAttendanceRow {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  estado: string;
  observacion: string;
}

@Component({
  selector: 'app-event-attendances-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    TableModule,
    AutoCompleteModule,
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
        <h1>Registrar Asistencia a Evento</h1>
        <div></div>
      </div>

      <div class="form-content">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Evento <span class="required">*</span></label>
            <p-dropdown
              [options]="eventOptions"
              [(ngModel)]="selectedEventId"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un evento..."
              (ngModelChange)="onEventChange($event)"
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="!selectedEventId && showErrors">
              El evento es requerido
            </small>
          </div>

          <div class="form-group full-width">
            <label>Feligres <span class="required">*</span></label>
            <p-autoComplete
              [(ngModel)]="selectedPerson"
              [suggestions]="filteredPersons"
              (completeMethod)="onSearchPersons($event)"
              (onSelect)="onSelectPerson($event)"
              field="nombres"
              [dropdown]="true"
              placeholder="Buscar por nombre o cedula"
              class="w-full"
            >
              <ng-template let-person pTemplate="item">
                <div class="person-item">
                  <span>{{ person.nombres }} {{ person.apellidos }}</span>
                  <small>{{ person.cedula }}</small>
                </div>
              </ng-template>
            </p-autoComplete>
            <small class="error" *ngIf="selectedEventId && personsAttendance.length === 0 && showErrors">
              Seleccione al menos un feligres
            </small>
          </div>
        </div>

        <div class="students-grid" *ngIf="personsAttendance.length > 0">
          <h3>Lista de Feligreses</h3>
          <p-table [value]="personsAttendance" [scrollable]="true" scrollHeight="400px">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 30%">Feligres</th>
                <th style="width: 15%">Cedula</th>
                <th style="width: 30%">Estado</th>
                <th style="width: 25%">Observacion</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-person>
              <tr>
                <td>{{ person.nombres }} {{ person.apellidos }}</td>
                <td>{{ person.cedula }}</td>
                <td>
                  <p-dropdown
                    [options]="estadoOptions"
                    [(ngModel)]="person.estado"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione..."
                    styleClass="w-full"
                  ></p-dropdown>
                </td>
                <td>
                  <textarea
                    pInputTextarea
                    [(ngModel)]="person.observacion"
                    placeholder="Observacion"
                    class="w-full"
                    rows="2"
                    [autoResize]="true"
                  ></textarea>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="info-message" *ngIf="selectedEventId && personsAttendance.length === 0 && !isLoadingPersons">
          <i class="pi pi-info-circle"></i>
          <span>No hay feligreses seleccionados</span>
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
            type="button"
            label="Guardar Asistencias"
            class="p-button-success"
            [disabled]="!canSave() || isSaving"
            [loading]="isSaving"
            (click)="onSubmit()"
          ></button>
        </div>
      </div>
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

      .error {
        color: #d32f2f;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .info-message {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
        font-size: 0.95rem;
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

      .students-grid {
        width: 100%;
        max-width: 1200px;
        margin-top: 20px;
      }

      .students-grid h3 {
        color: #333;
        font-size: 1.3rem;
        margin-bottom: 15px;
        font-weight: 600;
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
        .p-inputtextarea,
        .p-inputtext,
        .p-autocomplete {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-autocomplete .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-datatable td {
          padding: 8px;
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
export class EventAttendancesFormComponent implements OnInit {
  selectedEventId: number | null = null;
  eventOptions: Array<{ label: string; value: number }> = [];
  personsAttendance: PersonAttendanceRow[] = [];
  selectedPerson: Person | null = null;
  filteredPersons: Person[] = [];
  isLoadingPersons = false;
  isSaving = false;
  showErrors = false;

  estadoOptions = [
    { label: 'Presente', value: 'P' },
    { label: 'Ausente', value: 'A' },
    { label: 'Tardanza', value: 'T' },
    { label: 'Justificado', value: 'J' },
  ];

  constructor(
    private eventsService: EventsService,
    private eventAttendancesService: EventAttendancesService,
    private personsService: PersonsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.eventOptions = (response.data || []).map((event: Event) => ({
          label: `${event.nombre} - ${event.fecha}`,
          value: event.id,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar eventos');
      },
    });
  }

  onSearchPersons(event: { query: string }): void {
    const query = (event?.query || '').trim();
    if (!query) {
      this.filteredPersons = [];
      return;
    }

    this.isLoadingPersons = true;
    this.personsService.getAll(1, 20, query).subscribe({
      next: (response) => {
        const persons = response.data || [];
        this.filteredPersons = persons.filter((person) => person.isActive !== false);
        this.isLoadingPersons = false;
      },
      error: () => {
        this.isLoadingPersons = false;
        this.toastService.error('Error al buscar feligreses');
      },
    });
  }

  onEventChange(eventId: number): void {
    this.selectedEventId = eventId;
    this.showErrors = false;
  }

  onSelectPerson(event: { value: Person }): void {
    const person = event?.value;
    if (!person) return;

    const personId = Number(person.id);
    if (Number.isNaN(personId)) return;

    const exists = this.personsAttendance.some((row) => row.id === personId);
    if (exists) {
      this.selectedPerson = null;
      return;
    }

    this.personsAttendance = [
      ...this.personsAttendance,
      {
        id: personId,
        nombres: person.nombres || 'N/A',
        apellidos: person.apellidos || '',
        cedula: person.cedula || 'N/A',
        estado: 'P',
        observacion: '',
      },
    ];

    this.selectedPerson = null;
  }

  canSave(): boolean {
    return !!(this.selectedEventId && this.personsAttendance.length > 0);
  }

  onSubmit(): void {
    this.showErrors = true;

    if (!this.canSave()) {
      this.toastService.warn('Complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;

    const attendancePromises = this.personsAttendance.map((person) => {
      const data = {
        eventoId: this.selectedEventId!,
        feligresId: person.id,
        estado: person.estado || 'P',
        observacion: person.observacion || '',
      };

      return this.eventAttendancesService.create(data).toPromise();
    });

    Promise.all(attendancePromises)
      .then(() => {
        this.isSaving = false;
        this.toastService.success(`Se registraron ${this.personsAttendance.length} asistencias exitosamente`);
        this.onGoBack();
      })
      .catch((error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Error al registrar las asistencias');
      });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/event-attendances']);
  }
}
