import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendancesService, EncountersService } from '@app/services/modules/attendance.service';
import { EnrollmentsService } from '@app/services/modules/enrollment.service';
import { StudentsService } from '@app/services/modules/persons.service';
import { CoursesService } from '@app/services/modules/academic.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { Encounter, Attendance } from '@app/models/attendance.model';
import { Course } from '@app/models/academic.model';

@Component({
  selector: 'app-attendances-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    TableModule,
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
        <h1>Registrar Asistencia a Encuentro</h1>
        <div></div>
      </div>

      <div class="form-content">
        <div class="form-grid">
          <div class="form-group">
            <label>Curso <span class="required">*</span></label>
            <p-dropdown
              [options]="courseOptions"
              [(ngModel)]="selectedCourseId"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un curso..."
              (ngModelChange)="onCourseChange($event)"
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="!selectedCourseId && showErrors">
              El curso es requerido
            </small>
          </div>

          <div class="form-group">
            <label>Encuentro <span class="required">*</span></label>
            <p-dropdown
              [options]="encounters"
              [(ngModel)]="selectedEncuentroId"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un encuentro..."
              [disabled]="!selectedCourseId"
              class="w-full"
            ></p-dropdown>
            <small class="info" *ngIf="selectedCourseId && encounters.length === 0">
              Cargando encuentros... ({{ encounters.length }} disponibles)
            </small>
            <small class="error" *ngIf="!selectedEncuentroId && showErrors">
              El encuentro es requerido
            </small>
          </div>
        </div>

        <div class="students-grid" *ngIf="studentsAttendance.length > 0">
          <h3>Lista de Catequizandos</h3>
          <p-table [value]="studentsAttendance" [scrollable]="true" scrollHeight="400px">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 30%">Catequizando</th>
                <th style="width: 15%">Cédula</th>
                <th style="width: 30%">Estado</th>
                <th style="width: 25%">Observación</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-student let-i="rowIndex">
              <tr>
                <td>{{ student.nombres }} {{ student.apellidos }}</td>
                <td>{{ student.cedula }}</td>
                <td>
                  <p-dropdown
                    [options]="estadoOptions"
                    [(ngModel)]="student.estado"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione..."
                    styleClass="w-full"
                    appendTo="body"
                    [showClear]="false"
                  ></p-dropdown>
                </td>
                <td>
                  <textarea
                    pInputTextarea
                    [(ngModel)]="student.observacion"
                    placeholder="Observación"
                    class="w-full"
                    rows="2"
                    [autoResize]="true"
                  ></textarea>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="info-message" *ngIf="selectedCourseId && studentsAttendance.length === 0 && !isLoadingStudents">
          <i class="pi pi-info-circle"></i>
          <span>No hay catequizandos matriculados en este curso</span>
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

      .students-grid :host ::ng-deep .p-datatable td {
        padding: 8px;
      }

      .students-grid :host ::ng-deep .p-dropdown,
      .students-grid :host ::ng-deep .p-inputtext {
        width: 100% !important;
      }

      .info-message {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        background: #e3f2fd;
        border: 1px solid #90caf9;
        border-radius: 6px;
        color: #1976d2;
        font-size: 0.95rem;
        max-width: 800px;
        width: 100%;
      }

      .info-message i {
        font-size: 1.2rem;
      }

      :host ::ng-deep {
        .p-dropdown,
        .p-autocomplete,
        .p-inputtext {
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

        .p-calendar .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-dropdown-panel,
        .p-autocomplete-panel {
          min-width: 250px !important;
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
export class AttendancesFormComponent implements OnInit {
  isSaving = false;
  isLoadingStudents = false;
  showErrors = false;

  selectedCourseId: number | null = null;
  selectedEncuentroId: number | null = null;

  courseOptions: any[] = [];
  encounters: any[] = [];
  studentsAttendance: any[] = [];

  estadoOptions: Array<{ label: string; value: string }> = [];

  constructor(
    private attendancesService: AttendancesService,
    private encountersService: EncountersService,
    private enrollmentsService: EnrollmentsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEstadoOptions();
    this.loadCourses();
  }

  loadEstadoOptions(): void {
    this.parameterTypesService.getByType('AsistenciaEncuentro').subscribe({
      next: (items) => {
        this.estadoOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Error al cargar estados de asistencia');
      },
    });
  }

  loadCourses(): void {
    this.coursesService.getAll(1, 500).subscribe({
      next: (response: any) => {
        const courses = response.data || [];
        this.courseOptions = courses.map((course: Course) => ({
          label: `${course.grupo} - ${course.paralelo}${course.aula ? ' (' + course.aula + ')' : ''}`,
          value: course.id,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar cursos');
      },
    });
  }

  onCourseChange(courseId?: number): void {
    console.log('Course changed to:', courseId || this.selectedCourseId);
    console.log('selectedCourseId type:', typeof (courseId || this.selectedCourseId));
    this.studentsAttendance = [];
    this.selectedEncuentroId = null;
    this.encounters = [];
    
    const selectedId = courseId || this.selectedCourseId;
    
    if (selectedId) {
      console.log('Calling loadEncountersByCourse with:', selectedId);
      this.loadEncountersByCourse(selectedId);
      console.log('Calling loadStudentsByCourse with:', selectedId);
      this.loadStudentsByCourse(selectedId);
    } else {
      console.log('No course selected, skipping load');
    }
  }

  loadEncountersByCourse(courseId: number): void {
    console.log('Loading encounters for course:', courseId);
    this.encountersService.getAll(1, 1000, '').subscribe({
      next: (response) => {
        const allEncounters = response.data || [];
        console.log('All encounters received:', allEncounters);
        this.encounters = allEncounters
          .filter((encounter: Encounter) => {
            const encounterCursoId = Number(encounter.cursoId);
            console.log('Encounter cursoId:', encounter.cursoId, 'type:', typeof encounter.cursoId, 'converted:', encounterCursoId, 'vs courseId:', courseId, 'match:', encounterCursoId === courseId);
            return encounterCursoId === courseId;
          })
          .map((encounter: Encounter) => ({
            label: `${encounter.tema} - ${encounter.fecha}`,
            value: encounter.id,
          }));
        
        console.log('Filtered encounters:', this.encounters);
        if (this.encounters.length === 0) {
          this.toastService.info('No hay encuentros registrados para este curso');
        }
      },
      error: () => {
        this.toastService.error('Error al cargar encuentros');
        this.encounters = [];
      },
    });
  }

  loadStudentsByCourse(courseId: number): void {
    this.isLoadingStudents = true;
    console.log('Loading students for course:', courseId);
    this.enrollmentsService.getAll(1, 1000, '').subscribe({
      next: (response: any) => {
        console.log('All enrollments received:', response.data);
        const allEnrollments = response.data || [];
        
        // Filter by course
        const filteredEnrollments = allEnrollments.filter((enrollment: any) => {
          console.log('Enrollment cursoId:', enrollment.cursoId, 'vs courseId:', courseId);
          return enrollment.cursoId === courseId;
        });
        
        console.log('Filtered enrollments:', filteredEnrollments);
        
        // Get student IDs
        const studentIds = filteredEnrollments.map((e: any) => e.catequizandoId);
        
        if (studentIds.length === 0) {
          this.studentsAttendance = [];
          this.isLoadingStudents = false;
          return;
        }
        
        // Load full student data with person info
        this.studentsService.getAll(1, 1000, '').subscribe({
          next: (studentsResponse: any) => {
            const allStudents = studentsResponse.data || [];
            
            this.studentsAttendance = studentIds.map((studentId: number) => {
              const student = allStudents.find((s: any) => s.id === studentId);
              
              return {
                id: studentId,
                nombres: student?.person?.nombres || 'N/A',
                apellidos: student?.person?.apellidos || '',
                cedula: student?.person?.cedula || 'N/A',
                estado: 'AA', // Default: Asistió
                observacion: '',
              };
            });
            
            console.log('Students attendance array with names:', this.studentsAttendance);
            this.isLoadingStudents = false;
          },
          error: (err) => {
            console.error('Error loading student details:', err);
            this.toastService.error('Error al cargar detalles de estudiantes');
            this.studentsAttendance = [];
            this.isLoadingStudents = false;
          },
        });
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.toastService.error('Error al cargar estudiantes del curso');
        this.studentsAttendance = [];
        this.isLoadingStudents = false;
      },
    });
  }

  canSave(): boolean {
    return !!(this.selectedCourseId && this.selectedEncuentroId && this.studentsAttendance.length > 0);
  }

  onSubmit(): void {
    this.showErrors = true;

    if (!this.canSave()) {
      this.toastService.warn('Complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;

    // Create attendance records for all students
    const attendancePromises = this.studentsAttendance.map((student) => {
      const data = {
        encuentroId: this.selectedEncuentroId!,
        catequizandoId: student.id,
        estado: student.estado || 'P',
        observacion: student.observacion || '',
      };

      return this.attendancesService.create(data).toPromise();
    });

    Promise.all(attendancePromises)
      .then(() => {
        this.isSaving = false;
        this.toastService.success(`Se registraron ${this.studentsAttendance.length} asistencias exitosamente`);
        this.onGoBack();
      })
      .catch((error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Error al registrar las asistencias');
      });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/attendances']);
  }
}
