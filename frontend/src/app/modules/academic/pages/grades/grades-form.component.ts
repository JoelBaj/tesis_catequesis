import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '@app/services/modules/academic.service';
import { EnrollmentsService } from '@app/services/modules/enrollment.service';
import { StudentsService } from '@app/services/modules/persons.service';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { GradesService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { Course } from '@app/models/academic.model';
import * as XLSX from 'xlsx';

interface GradeRow {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  tareas?: number | null;
  lecciones?: number | null;
  evaluacionOral?: number | null;
  evaluacionEscrita?: number | null;
  cualitativa: string;
  cuantitativa?: number | null;
  observaciones?: string;
}

@Component({
  selector: 'app-grades-form',
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
    InputNumberModule,
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
        <h1>Registrar Calificaciones</h1>
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
            <label>Periodo <span class="required">*</span></label>
            <p-dropdown
              [options]="periodoOptions"
              [(ngModel)]="selectedPeriodo"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un periodo..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="!selectedPeriodo && showErrors">
              El periodo es requerido
            </small>
          </div>

          <div class="form-group">
            <label>Parcial <span class="required">*</span></label>
            <p-dropdown
              [options]="parcialOptions"
              [(ngModel)]="selectedParcial"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione un parcial..."
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="!selectedParcial && showErrors">
              El parcial es requerido
            </small>
          </div>
        </div>

        <div class="template-actions" *ngIf="canUseTemplateActions()">
          <button
            pButton
            type="button"
            icon="pi pi-download"
            label="Descargar plantilla"
            class="p-button-secondary template-btn template-btn-download"
            (click)="onDownloadTemplate()"
          ></button>
          <button
            pButton
            type="button"
            icon="pi pi-upload"
            label="Cargar archivo"
            class="p-button-info template-btn template-btn-upload"
            (click)="fileInput.click()"
          ></button>
          <input
            #fileInput
            type="file"
            accept=".xlsx,.xls"
            (change)="onFileSelected($event)"
            hidden
          />
        </div>

        <div class="students-grid" *ngIf="gradesRows.length > 0">
          <h3>Lista de Catequizandos</h3>
          <p-table
            [value]="gradesRows"
            [scrollable]="true"
            scrollHeight="400px"
            styleClass="grades-table"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="col-student">Catequizando</th>
                <th class="col-cedula">Cedula</th>
                <th class="col-score">Tareas</th>
                <th class="col-score">Lecciones</th>
                <th class="col-score">Eval. Oral</th>
                <th class="col-score">Eval. Escrita</th>
                <th class="col-qual">Cualitativa</th>
                <th class="col-score">Cuantitativa</th>
                <th class="col-notes">Observaciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="col-student">
                  <span class="student-name">{{ row.nombres }} {{ row.apellidos }}</span>
                </td>
                <td class="col-cedula">{{ row.cedula }}</td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="row.tareas"
                    (ngModelChange)="updateRowAverage(row)"
                    [useGrouping]="false"
                    [min]="0"
                    [max]="10"
                    [maxFractionDigits]="2"
                    class="w-full"
                  ></p-inputNumber>
                </td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="row.lecciones"
                    (ngModelChange)="updateRowAverage(row)"
                    [useGrouping]="false"
                    [min]="0"
                    [max]="10"
                    [maxFractionDigits]="2"
                    class="w-full"
                  ></p-inputNumber>
                </td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="row.evaluacionOral"
                    (ngModelChange)="updateRowAverage(row)"
                    [useGrouping]="false"
                    [min]="0"
                    [max]="10"
                    [maxFractionDigits]="2"
                    class="w-full"
                  ></p-inputNumber>
                </td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="row.evaluacionEscrita"
                    (ngModelChange)="updateRowAverage(row)"
                    [useGrouping]="false"
                    [min]="0"
                    [max]="10"
                    [maxFractionDigits]="2"
                    class="w-full"
                  ></p-inputNumber>
                </td>
                <td class="col-qual">
                  <p-dropdown
                    [options]="notaOptions"
                    [(ngModel)]="row.cualitativa"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione..."
                    styleClass="w-full"
                  ></p-dropdown>
                </td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="row.cuantitativa"
                    [useGrouping]="false"
                    [min]="0"
                    [max]="10"
                    [maxFractionDigits]="2"
                    [readonly]="true"
                    class="w-full"
                  ></p-inputNumber>
                </td>
                <td class="col-notes">
                  <textarea
                    pInputTextarea
                    [(ngModel)]="row.observaciones"
                    placeholder="Observaciones"
                    class="w-full"
                    rows="2"
                    [autoResize]="true"
                  ></textarea>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <div class="info-message" *ngIf="selectedCourseId && gradesRows.length === 0 && !isLoadingStudents">
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
            label="Guardar Calificaciones"
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

      .students-grid {
        width: 100%;
        max-width: 1400px;
        margin-top: 20px;
      }

      .template-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        width: 100%;
        max-width: 1200px;
        margin-top: 8px;
      }

      .template-actions .template-btn {
        border-radius: 999px;
        padding: 10px 18px;
        font-weight: 600;
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .template-actions .template-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
      }

      .template-actions .template-btn-download {
        background: #0f172a;
        border-color: #0f172a;
      }

      .template-actions .template-btn-upload {
        background: #0ea5e9;
        border-color: #0ea5e9;
      }

      .grades-table {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px;
      }

      .grades-table ::ng-deep .p-datatable-wrapper {
        border-radius: 8px;
        overflow: hidden;
        background: #ffffff;
      }

      .grades-table ::ng-deep .p-datatable-table {
        table-layout: fixed;
        width: 100%;
        min-width: 1200px;
      }

      .grades-table ::ng-deep th,
      .grades-table ::ng-deep td {
        vertical-align: top;
      }

      .grades-table ::ng-deep th {
        background: #f1f5f9;
        color: #0f172a;
        font-weight: 700;
        white-space: normal;
        line-height: 1.2;
        padding: 14px 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .grades-table ::ng-deep td {
        padding: 12px 16px;
        border-bottom: 1px solid #eef2f7;
      }

      .grades-table ::ng-deep tbody tr:nth-child(even) td {
        background: #fbfdff;
      }

      .grades-table ::ng-deep tbody tr:hover td {
        background: #f0f9ff;
      }

      .grades-table ::ng-deep .col-student {
        width: 240px;
      }

      .grades-table ::ng-deep .col-cedula {
        width: 150px;
      }

      .grades-table ::ng-deep .col-score {
        width: 120px;
      }

      .grades-table ::ng-deep .col-qual {
        width: 180px;
      }

      .grades-table ::ng-deep .col-notes {
        width: 300px;
      }

      .student-name {
        display: block;
        white-space: normal;
        word-break: break-word;
        font-weight: 600;
        color: #1f2937;
      }

      .students-grid h3 {
        color: #333;
        font-size: 1.3rem;
        margin-bottom: 15px;
        font-weight: 600;
      }

      .w-full {
        width: 100%;
      }

      :host ::ng-deep {
        .p-dropdown,
        .p-inputtext,
        .p-inputtextarea,
        .p-inputnumber {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-inputtext,
        .p-inputnumber input {
          height: 42px;
          padding: 10px 12px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
          background: #ffffff;
        }

        .p-inputtextarea {
          min-height: 64px;
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
export class GradesFormComponent implements OnInit {
  selectedCourseId: number | null = null;
  selectedPeriodo = '';
  selectedParcial = '';
  courseOptions: Array<{ label: string; value: number }> = [];
  coursesById = new Map<number, Course>();
  gradesRows: GradeRow[] = [];
  notaOptions: Array<{ label: string; value: string }> = [];
  periodoOptions: Array<{ label: string; value: string }> = [];
  parcialOptions: Array<{ label: string; value: string }> = [];
  isLoadingStudents = false;
  isSaving = false;
  showErrors = false;

  constructor(
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
    private studentsService: StudentsService,
    private parameterTypesService: ParameterTypesService,
    private gradesService: GradesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadNotaOptions();
    this.loadPeriodoOptions();
    this.loadParcialOptions();
  }

  loadCourses(): void {
    this.coursesService.getAll(1, 1000, '').subscribe({
      next: (response) => {
        const courses = response.data || [];
        this.courseOptions = courses.map((course: Course) => ({
          label: `${course.grupo || ''} ${course.paralelo || ''}`.trim(),
          value: Number(course.id),
        }));
        this.coursesById.clear();
        courses.forEach((course: Course) => {
          this.coursesById.set(Number(course.id), course);
        });
      },
      error: () => {
        this.toastService.error('Error al cargar cursos');
      },
    });
  }

  loadNotaOptions(): void {
    this.parameterTypesService.getByType('Nota').subscribe({
      next: (items) => {
        this.notaOptions = (items || []).map((item) => ({
          label: item.descripcion,
          value: item.codigo,
        }));
      },
      error: () => {
        this.toastService.error('Error al cargar opciones de nota');
      },
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
      error: () => {
        this.toastService.error('Error al cargar periodos');
      },
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
      error: () => {
        this.toastService.error('Error al cargar parciales');
      },
    });
  }

  onCourseChange(courseId: number): void {
    this.selectedCourseId = courseId;
    const course = this.coursesById.get(Number(courseId));
    if (course?.periodo) {
      this.selectedPeriodo = course.periodo;
    }
    this.loadStudentsByCourse(courseId);
  }

  loadStudentsByCourse(courseId: number): void {
    this.isLoadingStudents = true;
    this.enrollmentsService.getAll(1, 1000, '').subscribe({
      next: (response: any) => {
        const allEnrollments = response.data || [];
        const filteredEnrollments = allEnrollments.filter((enrollment: any) => {
          return Number(enrollment.cursoId) === Number(courseId);
        });

        const studentIds = filteredEnrollments.map((e: any) => Number(e.catequizandoId));
        if (studentIds.length === 0) {
          this.gradesRows = [];
          this.isLoadingStudents = false;
          return;
        }

        this.studentsService.getAll(1, 1000, '').subscribe({
          next: (studentsResponse: any) => {
            const allStudents = studentsResponse.data || [];
            const defaultCualitativa = this.notaOptions[0]?.value || '';

            this.gradesRows = studentIds.map((studentId: number) => {
              const student = allStudents.find((s: any) => Number(s.id) === studentId);
              return {
                id: studentId,
                nombres: student?.person?.nombres || 'N/A',
                apellidos: student?.person?.apellidos || '',
                cedula: student?.person?.cedula || 'N/A',
                tareas: null,
                lecciones: null,
                evaluacionOral: null,
                evaluacionEscrita: null,
                cualitativa: defaultCualitativa,
                cuantitativa: null,
                observaciones: '',
              };
            });

            this.isLoadingStudents = false;
          },
          error: () => {
            this.toastService.error('Error al cargar detalles de estudiantes');
            this.gradesRows = [];
            this.isLoadingStudents = false;
          },
        });
      },
      error: () => {
        this.toastService.error('Error al cargar estudiantes del curso');
        this.gradesRows = [];
        this.isLoadingStudents = false;
      },
    });
  }

  canSave(): boolean {
    return !!(
      this.selectedCourseId &&
      this.selectedPeriodo &&
      this.selectedParcial &&
      this.gradesRows.length > 0
    );
  }

  canUseTemplateActions(): boolean {
    return !!(
      this.selectedCourseId &&
      this.selectedPeriodo &&
      this.selectedParcial &&
      this.gradesRows.length > 0
    );
  }

  onDownloadTemplate(): void {
    if (!this.canUseTemplateActions()) {
      this.toastService.warn('Seleccione curso, periodo y parcial primero');
      return;
    }

    const header = [
      'cedula',
      'nombres',
      'apellidos',
      'tareas',
      'lecciones',
      'evaluacion_oral',
      'evaluacion_escrita',
      'cualitativa',
      'observaciones',
    ];

    const rows = this.gradesRows.map((row) => [
      row.cedula,
      row.nombres,
      row.apellidos,
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
    sheet['!cols'] = [
      { wch: 14 },
      { wch: 20 },
      { wch: 22 },
      { wch: 10 },
      { wch: 10 },
      { wch: 14 },
      { wch: 16 },
      { wch: 14 },
      { wch: 28 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Calificaciones');

    const helpRows = [
      ['Campo', 'Descripcion', 'Valores permitidos'],
      [
        'cualitativa',
        'Use el codigo o la descripcion exacta de la nota cualitativa.',
        this.notaOptions.map((item) => `${item.value} = ${item.label}`).join(' | '),
      ],
      [
        'tareas/lecciones/evaluacion_oral/evaluacion_escrita',
        'Valores numericos entre 0 y 10 con decimales.',
        'Ejemplo: 9.5',
      ],
    ];
    const helpSheet = XLSX.utils.aoa_to_sheet(helpRows);
    helpSheet['!cols'] = [{ wch: 35 }, { wch: 70 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(workbook, helpSheet, 'Ayuda');

    const fileName = `calificaciones_${this.selectedPeriodo}_${this.selectedParcial}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as Array<any[]>;
      if (!rows.length) {
        this.toastService.warn('El archivo esta vacio');
        return;
      }

      const headerRow = rows[0].map((cell) => String(cell).trim().toLowerCase());
      const indexMap = this.getTemplateColumnIndexes(headerRow);
      if (indexMap.cedula === -1) {
        this.toastService.error('La columna "cedula" es obligatoria');
        return;
      }

      const rowsByCedula = new Map<string, GradeRow>();
      this.gradesRows.forEach((row) => {
        rowsByCedula.set(String(row.cedula).trim(), row);
      });

      let updated = 0;
      const missing: string[] = [];

      rows.slice(1).forEach((row) => {
        const cedula = String(row[indexMap.cedula] ?? '').trim();
        if (!cedula) return;
        const target = rowsByCedula.get(cedula);
        if (!target) {
          missing.push(cedula);
          return;
        }

        target.tareas = this.parseNumber(row[indexMap.tareas]);
        target.lecciones = this.parseNumber(row[indexMap.lecciones]);
        target.evaluacionOral = this.parseNumber(row[indexMap.evaluacionOral]);
        target.evaluacionEscrita = this.parseNumber(row[indexMap.evaluacionEscrita]);
        target.observaciones = String(row[indexMap.observaciones] ?? '').trim();

        const cualitativaValue = String(row[indexMap.cualitativa] ?? '').trim();
        if (cualitativaValue) {
          const matched = this.findNotaValue(cualitativaValue);
          if (matched) {
            target.cualitativa = matched;
          }
        }

        this.updateRowAverage(target);
        updated += 1;
      });

      if (updated > 0) {
        this.toastService.success(`Archivo cargado: ${updated} registros actualizados`);
      } else {
        this.toastService.warn('No se actualizaron registros');
      }

      if (missing.length > 0) {
        this.toastService.warn(`Cedulas no encontradas: ${missing.length}`);
      }
    };

    reader.onerror = () => {
      this.toastService.error('No se pudo leer el archivo');
    };

    reader.readAsArrayBuffer(file);
    input.value = '';
  }

  private getTemplateColumnIndexes(headerRow: string[]) {
    const findIndex = (names: string[]) =>
      headerRow.findIndex((cell) => names.includes(cell));

    return {
      cedula: findIndex(['cedula', 'cédula']),
      nombres: findIndex(['nombres', 'nombre']),
      apellidos: findIndex(['apellidos', 'apellido']),
      tareas: findIndex(['tareas', 'tarea']),
      lecciones: findIndex(['lecciones', 'leccion', 'lección']),
      evaluacionOral: findIndex(['evaluacion_oral', 'evaluación_oral', 'eval_oral']),
      evaluacionEscrita: findIndex(['evaluacion_escrita', 'evaluación_escrita', 'eval_escrita']),
      cualitativa: findIndex(['cualitativa', 'nota_cualitativa']),
      observaciones: findIndex(['observaciones', 'observacion', 'observación']),
    };
  }

  private parseNumber(value: unknown): number | null {
    const parsed = Number(String(value).replace(',', '.'));
    if (Number.isNaN(parsed)) {
      return null;
    }
    return parsed;
  }

  private findNotaValue(value: string): string | null {
    const normalized = value.trim().toLowerCase();
    const byCode = this.notaOptions.find((item) => item.value.toLowerCase() === normalized);
    if (byCode) {
      return byCode.value;
    }

    const byLabel = this.notaOptions.find((item) => item.label.toLowerCase() === normalized);
    return byLabel ? byLabel.value : null;
  }

  updateRowAverage(row: GradeRow): void {
    row.cuantitativa = this.calculateAverage(row);
  }

  private calculateAverage(row: GradeRow): number | null {
    const values = [row.tareas, row.lecciones, row.evaluacionOral, row.evaluacionEscrita].filter(
      (value) => typeof value === 'number' && !isNaN(value),
    ) as number[];

    if (values.length === 0) {
      return null;
    }

    const sum = values.reduce((total, value) => total + value, 0);
    return Number((sum / values.length).toFixed(2));
  }

  onSubmit(): void {
    this.showErrors = true;

    if (!this.canSave()) {
      this.toastService.warn('Complete todos los campos requeridos');
      return;
    }

    this.isSaving = true;

    const gradePromises = this.gradesRows.map((row) => {
      const data = {
        periodo: this.selectedPeriodo,
        parcial: this.selectedParcial,
        cursoId: this.selectedCourseId!,
        catequizandoId: row.id,
        tareas: row.tareas ?? undefined,
        lecciones: row.lecciones ?? undefined,
        evaluacionOral: row.evaluacionOral ?? undefined,
        evaluacionEscrita: row.evaluacionEscrita ?? undefined,
        cualitativa: row.cualitativa,
        cuantitativa: row.cuantitativa ?? undefined,
        observaciones: row.observaciones || '',
      };

      return this.gradesService.create(data).toPromise();
    });

    Promise.all(gradePromises)
      .then(() => {
        this.isSaving = false;
        this.toastService.success(`Se registraron ${this.gradesRows.length} calificaciones exitosamente`);
        this.onGoBack();
      })
      .catch((error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Error al registrar calificaciones');
      });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/grades']);
  }
}
