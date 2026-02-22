import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '@app/services/modules/academic.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { NotificationsService, AbsenceStudent, GradeStudent, EnrolledStudent, ParentPerson } from '@app/services/modules/notifications.service';
import { ToastService } from '@app/services/toast.service';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    CheckboxModule,
    AutoCompleteModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>Notificaciones</h1>
      </div>

      <div class="form-content">
        <form [formGroup]="form" (ngSubmit)="onSend()" class="form-grid">
          <div class="form-group" *ngIf="showCourse">
            <label>Curso <span class="required">*</span></label>
            <p-dropdown
              [options]="courseOptions"
              formControlName="courseId"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un curso..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('courseId')">
              {{ getFieldError('courseId') }}
            </small>
          </div>

          <div class="form-group" *ngIf="showPeriodo">
            <label>Periodo <span class="required">*</span></label>
            <p-dropdown
              [options]="periodoOptions"
              formControlName="periodo"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un periodo..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('periodo')">
              {{ getFieldError('periodo') }}
            </small>
          </div>

          <div class="form-group" *ngIf="showParcial">
            <label>Parcial <span class="required">*</span></label>
            <p-dropdown
              [options]="parcialOptions"
              formControlName="parcial"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un parcial..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('parcial')">
              {{ getFieldError('parcial') }}
            </small>
          </div>

          <div class="form-group full-width">
            <label>Asunto</label>
            <input
              pInputText
              formControlName="asunto"
              placeholder="Asunto del correo"
              class="w-full"
            />
          </div>

          <div class="form-group full-width">
            <label>Mensaje <span class="required">*</span></label>
            <textarea
              pInputTextarea
              formControlName="mensaje"
              [placeholder]="messagePlaceholder"
              class="w-full"
              rows="5"
            ></textarea>
            <small class="error" *ngIf="getFieldError('mensaje')">
              {{ getFieldError('mensaje') }}
            </small>
          </div>
        </form>

        <div *ngIf="showAbsencesGrid && absencesData.length === 0 && form.get('courseId')?.value && form.get('periodo')?.value" class="info-message">
          <p>No se encontraron estudiantes con más de 2 inasistencias para este curso y periodo.</p>
        </div>

        <div *ngIf="showAbsencesGrid && absencesData.length > 0" class="absences-grid">
          <h3>Estudiantes con más de 2 inasistencias</h3>
          <p-table [value]="absencesData" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">
                  <p-checkbox
                    [(ngModel)]="selectAllAbsences"
                    [binary]="true"
                    (onChange)="toggleSelectAllAbsences()"
                  ></p-checkbox>
                </th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Total Faltas</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-student>
              <tr>
                <td>
                  <p-checkbox
                    [(ngModel)]="student.selected"
                    [binary]="true"
                  ></p-checkbox>
                </td>
                <td>{{ student.nombres }}</td>
                <td>{{ student.apellidos }}</td>
                <td>{{ student.correo || '-' }}</td>
                <td>{{ student.absenceCount }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div *ngIf="showGradesGrid && gradesData.length === 0 && form.get('courseId')?.value && form.get('periodo')?.value && form.get('parcial')?.value" class="info-message">
          <p>No se encontraron calificaciones para este curso, periodo y parcial.</p>
        </div>

        <div *ngIf="showGradesGrid && gradesData.length > 0" class="grades-grid">
          <h3>Estudiantes con calificaciones registradas</h3>
          <p-table [value]="gradesData" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">
                  <p-checkbox
                    [(ngModel)]="selectAllGrades"
                    [binary]="true"
                    (onChange)="toggleSelectAllGrades()"
                  ></p-checkbox>
                </th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Cualitativa</th>
                <th>Cuantitativa</th>
                <th>Observaciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-student>
              <tr>
                <td>
                  <p-checkbox
                    [(ngModel)]="student.selected"
                    [binary]="true"
                  ></p-checkbox>
                </td>
                <td>{{ student.nombres }}</td>
                <td>{{ student.apellidos }}</td>
                <td>{{ student.correo || '-' }}</td>
                <td>{{ student.cualitativa }}</td>
                <td>{{ student.cuantitativa }}</td>
                <td>{{ student.observaciones || '-' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div *ngIf="showEncounterGrid && encounterData.length === 0 && form.get('courseId')?.value" class="info-message">
          <p>No se encontraron estudiantes matriculados en este curso.</p>
        </div>

        <div *ngIf="showEncounterGrid && encounterData.length > 0" class="encounter-grid">
          <h3>Estudiantes matriculados en el curso</h3>
          <p-table [value]="encounterData" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">
                  <p-checkbox
                    [(ngModel)]="selectAllEncounter"
                    [binary]="true"
                    (onChange)="toggleSelectAllEncounter()"
                  ></p-checkbox>
                </th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Cédula</th>
                <th>Correo</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-student>
              <tr>
                <td>
                  <p-checkbox
                    [(ngModel)]="student.selected"
                    [binary]="true"
                  ></p-checkbox>
                </td>
                <td>{{ student.nombres }}</td>
                <td>{{ student.apellidos }}</td>
                <td>{{ student.cedula || '-' }}</td>
                <td>{{ student.correo || '-' }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div *ngIf="showEventGrid" class="autocomplete-section">
          <h3>Agregar personas adicionales</h3>
          <div class="form-group full-width">
            <label>Buscar y agregar feligreses</label>
            <p-autoComplete
              [(ngModel)]="selectedPersons"
              [suggestions]="personSuggestions"
              (completeMethod)="searchPersons($event)"
              field="apellidos"
              [multiple]="true"
              placeholder="Buscar por nombre, apellido, cédula o correo..."
              class="w-full"
              [dropdown]="false"
              [minLength]="2"
            >
              <ng-template let-person pTemplate="item">
                <div>{{ person.apellidos }}, {{ person.nombres }} - {{ person.cedula }}</div>
              </ng-template>
            </p-autoComplete>
          </div>
        </div>

        <div *ngIf="showEventGrid && eventData.length > 0" class="event-grid">
          <h3>Padres y Representantes</h3>
          <p-table [value]="eventData" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">
                  <p-checkbox
                    [(ngModel)]="selectAllEvent"
                    [binary]="true"
                    (onChange)="toggleSelectAllEvent()"
                  ></p-checkbox>
                </th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Cédula</th>
                <th>Correo</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-person>
              <tr>
                <td>
                  <p-checkbox
                    [(ngModel)]="person.selected"
                    [binary]="true"
                  ></p-checkbox>
                </td>
                <td>
                  {{ person.nombres }}
                </td>
                <td>
                  {{ person.apellidos }}
                </td>
                <td>
                  {{ person.cedula || '-' }}
                </td>
                <td>
                  {{ person.correo || '-' }}
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="form-footer">
          <button
            pButton
            type="button"
            label="Enviar ahora"
            class="p-button-success"
            [disabled]="!canSend()"
            [loading]="isSending"
            (click)="onSend()"
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
        justify-content: center;
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

      .form-footer {
        display: flex;
        justify-content: flex-end;
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
        min-width: 150px;
        padding: 10px 20px;
      }

      .absences-grid {
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
      }

      .absences-grid h3 {
        margin-bottom: 12px;
        color: #333;
        font-size: 1.1rem;
      }

      .grades-grid {
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
      }

      .grades-grid h3 {
        margin-bottom: 12px;
        color: #333;
        font-size: 1.1rem;
      }

      .encounter-grid {
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
      }

      .encounter-grid h3 {
        margin-bottom: 12px;
        color: #333;
        font-size: 1.1rem;
      }

      .event-grid {
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
      }

      .event-grid h3 {
        margin-bottom: 12px;
        color: #333;
        font-size: 1.1rem;
      }

      .autocomplete-section {
        width: 100%;
        max-width: 900px;
      }

      .autocomplete-section h3 {
        margin-bottom: 12px;
        color: #333;
        font-size: 1.1rem;
      }

      .info-message {
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
        padding: 16px;
        background-color: #e3f2fd;
        border-left: 4px solid #2196f3;
        border-radius: 4px;
      }

      .info-message p {
        margin: 0;
        color: #1976d2;
        font-size: 0.95rem;
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

        .p-dropdown .p-inputtext,
        .p-inputtext,
        .p-inputtextarea {
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-button {
          border-radius: 6px;
        }

        .p-button-success {
          background-color: #10b981;
          border-color: #10b981;
        }
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class NotificationsComponent implements OnInit {
  form: FormGroup;
  isSending = false;

  courseOptions: Array<{ label: string; value: number }> = [];
  periodoOptions: Array<{ label: string; value: string }> = [];
  parcialOptions: Array<{ label: string; value: string }> = [];
  tipoOptions = ['Evento', 'Encuentro', 'Inasistencias', 'Notas'];
  showCourse = true;
  showPeriodo = false;
  showParcial = false;
  showAbsencesGrid = false;
  showGradesGrid = false;
  showEncounterGrid = false;
  showEventGrid = false;
  messagePlaceholder = 'Escriba el mensaje para los padres';
  absencesData: Array<AbsenceStudent & { selected: boolean }> = [];
  gradesData: Array<GradeStudent & { selected: boolean }> = [];
  encounterData: Array<EnrolledStudent & { selected: boolean }> = [];
  eventData: Array<ParentPerson & { selected: boolean }> = [];
  selectAllAbsences = false;
  selectAllGrades = false;
  selectAllEncounter = false;
  selectAllEvent = false;
  
  // Autocomplete for events
  personSuggestions: ParentPerson[] = [];
  selectedPersons: ParentPerson[] = [];

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private parameterTypesService: ParameterTypesService,
    private notificationsService: NotificationsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      courseId: [null, [Validators.required]],
      periodo: [''],
      parcial: [''],
      tipo: ['Evento', [Validators.required]],
      asunto: [''],
      mensaje: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadPeriodoOptions();
    this.loadParcialOptions();
    this.applyTypeConfig(this.form.get('tipo')?.value || 'Evento');

    this.route.queryParamMap.subscribe((params) => {
      const typeParam = params.get('type');
      if (typeParam) {
        this.setActiveType(typeParam);
      }
    });

    this.form.get('courseId')?.valueChanges.subscribe(() => {
      this.onCourseOrPeriodoChange();
    });

    this.form.get('periodo')?.valueChanges.subscribe(() => {
      this.onCourseOrPeriodoChange();
    });

    this.form.get('parcial')?.valueChanges.subscribe(() => {
      this.onCourseOrPeriodoChange();
    });
  }

  loadCourses(): void {
    this.coursesService.getAll(1, 1000, '').subscribe({
      next: (response) => {
        const courses = response.data || [];
        this.courseOptions = courses.map((course: any) => ({
          label: `${course.grupo || ''} ${course.paralelo || ''}`.trim(),
          value: Number(course.id),
        }));
      },
      error: () => this.toastService.error('Error al cargar cursos'),
    });
  }

  loadPeriodoOptions(): void {
    this.parameterTypesService.getByType('Periodo').subscribe({
      next: (items) => {
        this.periodoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => this.toastService.error('Error al cargar periodos'),
    });
  }

  loadParcialOptions(): void {
    this.parameterTypesService.getByType('Parcial').subscribe({
      next: (items) => {
        this.parcialOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => this.toastService.error('Error al cargar parciales'),
    });
  }

  private setActiveType(typeParam: string): void {
    const normalized = typeParam.trim().toLowerCase();
    const index = this.tipoOptions.findIndex(
      (tipo) => tipo.toLowerCase() === normalized,
    );
    const resolvedIndex = index >= 0 ? index : 0;
    const tipo = this.tipoOptions[resolvedIndex] || 'Evento';
    this.form.patchValue({ tipo });
    this.applyTypeConfig(tipo);
  }

  private applyTypeConfig(tipo: string): void {
    const isNotas = tipo === 'Notas';
    const isAbsences = tipo === 'Inasistencias';
    const isEncounter = tipo === 'Encuentro';
    const isEvent = tipo === 'Evento';
    
    // Configurar visibilidad de campos
    this.showCourse = !isEvent;
    this.showPeriodo = isNotas || isAbsences;
    this.showParcial = isNotas;
    this.showAbsencesGrid = isAbsences;
    this.showGradesGrid = isNotas;
    this.showEncounterGrid = isEncounter;
    this.showEventGrid = isEvent;

    const courseControl = this.form.get('courseId');
    const periodoControl = this.form.get('periodo');
    const parcialControl = this.form.get('parcial');

    if (isEvent) {
      courseControl?.clearValidators();
      periodoControl?.clearValidators();
      parcialControl?.clearValidators();
      this.form.patchValue({ courseId: null, periodo: '', parcial: '' });
      this.loadParentsRepresentatives();
    } else if (isNotas) {
      courseControl?.setValidators([Validators.required]);
      periodoControl?.setValidators([Validators.required]);
      parcialControl?.setValidators([Validators.required]);
    } else if (isAbsences) {
      courseControl?.setValidators([Validators.required]);
      periodoControl?.setValidators([Validators.required]);
      parcialControl?.clearValidators();
      this.form.patchValue({ parcial: '' });
    } else {
      courseControl?.setValidators([Validators.required]);
      periodoControl?.clearValidators();
      parcialControl?.clearValidators();
      this.form.patchValue({ periodo: '', parcial: '' });
    }

    courseControl?.updateValueAndValidity();
    periodoControl?.updateValueAndValidity();
    parcialControl?.updateValueAndValidity();

    this.messagePlaceholder = this.getMessagePlaceholder(tipo);
    let defaultAsunto = '';
    switch (tipo) {
      case 'Evento':
        defaultAsunto = 'Notificación de Evento';
        break;
      case 'Encuentro':
        defaultAsunto = 'Notificación de Encuentro';
        break;
      case 'Inasistencias':
        defaultAsunto = 'Notificación de Inasistencias';
        break;
      case 'Notas':
        defaultAsunto = 'Notificación de Notas';
        break;
      default:
        defaultAsunto = `Notificación de ${tipo}`;
    }
    // Siempre actualizar el asunto y mensaje al cambiar el tipo
    this.form.patchValue({
      asunto: defaultAsunto,
      mensaje: this.getMessagePlaceholder(tipo)
    });

    if (isAbsences) {
      this.onCourseOrPeriodoChange();
    } else if (isNotas) {
      this.onCourseOrPeriodoChange();
    } else if (isEncounter) {
      this.onCourseOrPeriodoChange();
    } else if (!isEvent) {
      this.absencesData = [];
      this.gradesData = [];
      this.encounterData = [];
      this.eventData = [];
      this.selectedPersons = [];
    }
  }

  private getMessagePlaceholder(tipo: string): string {
    switch (tipo) {
      case 'Evento':
        return 'Detalle del evento y cualquier indicacion para los padres';
      case 'Encuentro':
        return 'Mensaje sobre el encuentro (fecha, hora, recomendaciones)';
      case 'Inasistencias':
        return 'Detalle de inasistencias y acciones a tomar';
      case 'Notas':
        return 'Resumen de notas del parcial y observaciones';
      default:
        return 'Escriba el mensaje para los padres';
    }
  }

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return 'Este campo es requerido';
    return null;
  }

  onCourseOrPeriodoChange(): void {
    const tipo = this.form.get('tipo')?.value;
    
    if (tipo === 'Inasistencias') {
      const courseId = this.form.get('courseId')?.value;
      const periodo = this.form.get('periodo')?.value;

      if (!courseId || !periodo) {
        this.absencesData = [];
        return;
      }

      this.notificationsService.getAbsences(courseId, periodo).subscribe({
        next: (students) => {
          this.absencesData = students.map((s) => ({ ...s, selected: false }));
          this.selectAllAbsences = false;
        },
        error: () => {
          this.toastService.error('Error al cargar estudiantes con inasistencias');
          this.absencesData = [];
        },
      });
    } else if (tipo === 'Notas') {
      const courseId = this.form.get('courseId')?.value;
      const periodo = this.form.get('periodo')?.value;
      const parcial = this.form.get('parcial')?.value;

      if (!courseId || !periodo || !parcial) {
        this.gradesData = [];
        return;
      }

      this.notificationsService.getGrades(courseId, periodo, parcial).subscribe({
        next: (students) => {
          this.gradesData = students.map((s) => ({ ...s, selected: false }));
          this.selectAllGrades = false;
        },
        error: () => {
          this.toastService.error('Error al cargar calificaciones');
          this.gradesData = [];
        },
      });
    } else if (tipo === 'Encuentro') {
      const courseId = this.form.get('courseId')?.value;

      if (!courseId) {
        this.encounterData = [];
        return;
      }

      this.notificationsService.getEnrolledStudents(courseId).subscribe({
        next: (students) => {
          this.encounterData = students.map((s) => ({ ...s, selected: false }));
          this.selectAllEncounter = false;
        },
        error: () => {
          this.toastService.error('Error al cargar estudiantes matriculados');
          this.encounterData = [];
        },
      });
    }
  }

  loadParentsRepresentatives(): void {
    this.notificationsService.getParentsRepresentatives().subscribe({
      next: (persons) => {
        this.eventData = persons.map((p) => ({ ...p, selected: false }));
        this.selectAllEvent = false;
      },
      error: () => {
        this.toastService.error('Error al cargar padres y representantes');
        this.eventData = [];
      },
    });
  }

  searchPersons(event: any): void {
    const query = event.query;
    if (!query || query.length < 2) {
      this.personSuggestions = [];
      return;
    }

    this.notificationsService.searchPersons(query).subscribe({
      next: (persons) => {
        this.personSuggestions = persons;
      },
      error: () => {
        this.personSuggestions = [];
      },
    });
  }

  toggleSelectAllAbsences(): void {
    this.absencesData.forEach((s) => (s.selected = this.selectAllAbsences));
  }

  toggleSelectAllGrades(): void {
    this.gradesData.forEach((s) => (s.selected = this.selectAllGrades));
  }

  toggleSelectAllEncounter(): void {
    this.encounterData.forEach((s) => (s.selected = this.selectAllEncounter));
  }

  toggleSelectAllEvent(): void {
    this.eventData.forEach((p) => (p.selected = this.selectAllEvent));
  }

  canSend(): boolean {
    if (!this.form.valid || this.isSending) {
      return false;
    }

    const tipo = this.form.get('tipo')?.value;
    if (tipo === 'Inasistencias') {
      return this.absencesData.some((s) => s.selected);
    }
    if (tipo === 'Notas') {
      return this.gradesData.some((s) => s.selected);
    }
    if (tipo === 'Encuentro') {
      return this.encounterData.some((s) => s.selected);
    }
    if (tipo === 'Evento') {
      const hasSelectedFromGrid = this.eventData.some((p) => p.selected);
      const hasSelectedFromAutocomplete = this.selectedPersons.length > 0;
      return hasSelectedFromGrid || hasSelectedFromAutocomplete;
    }

    return true;
  }

  onSend(): void {
    if (!this.canSend()) {
      this.form.markAllAsTouched();
      return;
    }

    const tipo = this.form.get('tipo')?.value;
    this.isSending = true;

    if (tipo === 'Inasistencias') {
      const selectedIds = this.absencesData.filter((s) => s.selected).map((s) => s.id);
      const payload = {
        courseId: this.form.get('courseId')?.value,
        periodo: this.form.get('periodo')?.value,
        studentIds: selectedIds,
        asunto: this.form.get('asunto')?.value,
        mensaje: this.form.get('mensaje')?.value,
      };

      this.notificationsService.sendAbsences(payload).subscribe({
        next: (response: any) => {
          this.isSending = false;
          if (response?.sent > 0) {
            this.toastService.success(`Notificaciones enviadas: ${response.sent}`);
          } else {
            this.toastService.warn(response?.message || 'No se enviaron notificaciones');
          }
        },
        error: (error) => {
          this.isSending = false;
          this.toastService.error(error?.error?.message || 'Error al enviar notificaciones');
        },
      });
    } else if (tipo === 'Notas') {
      const selectedIds = this.gradesData.filter((s) => s.selected).map((s) => s.id);
      const payload = {
        courseId: this.form.get('courseId')?.value,
        periodo: this.form.get('periodo')?.value,
        parcial: this.form.get('parcial')?.value,
        studentIds: selectedIds,
        subject: this.form.get('asunto')?.value,
        message: this.form.get('mensaje')?.value,
      };

      this.notificationsService.sendGrades(payload).subscribe({
        next: (response: any) => {
          this.isSending = false;
          if (response?.sent > 0) {
            this.toastService.success(`Notificaciones enviadas: ${response.sent}`);
          } else {
            this.toastService.warn(response?.message || 'No se enviaron notificaciones');
          }
        },
        error: (error) => {
          this.isSending = false;
          this.toastService.error(error?.error?.message || 'Error al enviar notificaciones');
        },
      });
    } else if (tipo === 'Encuentro') {
      const selectedIds = this.encounterData.filter((s) => s.selected).map((s) => s.id);
      const payload = {
        courseId: this.form.get('courseId')?.value,
        studentIds: selectedIds,
        subject: this.form.get('asunto')?.value,
        message: this.form.get('mensaje')?.value,
      };

      this.notificationsService.sendEncounter(payload).subscribe({
        next: (response: any) => {
          this.isSending = false;
          if (response?.sent > 0) {
            this.toastService.success(`Notificaciones enviadas: ${response.sent}`);
          } else {
            this.toastService.warn(response?.message || 'No se enviaron notificaciones');
          }
        },
        error: (error) => {
          this.isSending = false;
          this.toastService.error(error?.error?.message || 'Error al enviar notificaciones');
        },
      });
    } else if (tipo === 'Evento') {
      // Combinar IDs del grid y del autocomplete
      const gridIds = this.eventData.filter((p) => p.selected).map((p) => p.id);
      const autocompleteIds = this.selectedPersons.map((p) => p.id);
      const allPersonIds = [...new Set([...gridIds, ...autocompleteIds])]; // Eliminar duplicados

      const payload = {
        personIds: allPersonIds,
        subject: this.form.get('asunto')?.value || 'Notificacion de Evento',
        message: this.form.get('mensaje')?.value,
      };

      this.notificationsService.sendEvent(payload).subscribe({
        next: (response: any) => {
          this.isSending = false;
          if (response?.sent > 0) {
            this.toastService.success(`Notificaciones enviadas: ${response.sent}`);
          } else {
            this.toastService.warn(response?.message || 'No se enviaron notificaciones');
          }
        },
        error: (error) => {
          this.isSending = false;
          this.toastService.error(error?.error?.message || 'Error al enviar notificaciones');
        },
      });
    } else {
      this.notificationsService.sendCourse(this.form.value).subscribe({
        next: (response: any) => {
          this.isSending = false;
          if (response?.sent > 0) {
            this.toastService.success(`Notificaciones enviadas: ${response.sent}`);
          } else {
            this.toastService.warn(response?.message || 'No se enviaron notificaciones');
          }
        },
        error: (error) => {
          this.isSending = false;
          this.toastService.error(error?.error?.message || 'Error al enviar notificaciones');
        },
      });
    }
  }
}
