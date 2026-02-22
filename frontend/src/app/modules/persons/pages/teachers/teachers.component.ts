import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Teacher } from '@app/models/persons.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TeachersService } from '@app/services/modules/persons.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GridSharedComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
  ],
  template: `
    <div class="page-container">
      <h1>Docentes</h1>

      <app-grid-shared
        [columns]="columns"
        [rows]="teachers"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="['person.nombres', 'person.apellidos', 'person.correo']"
        (add)="onOpenForm()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      ></app-grid-shared>

      <p-dialog [visible]="isFormOpen" [modal]="true" [header]="formTitle" [style]="{ width: formWidth }" (onHide)="onCloseForm()">
        <form [formGroup]="teacherForm" (ngSubmit)="onSubmit()">
          <div class="form-row-2">
            <div class="form-row-2">
              <div class="form-group">
                <label>Nombre</label>
                <input pInputText formControlName="nombres" placeholder="Ingrese el nombre" class="w-full" />
              </div>
              <div class="form-group">
                <label>Apellido</label>
                <input pInputText formControlName="apellidos" placeholder="Ingrese el apellido" class="w-full" />
              </div>
            </div>
            <label>Cédula</label>
            <input
              pInputText
              formControlName="cedula"
              placeholder="Ingrese el número de cédula"
              class="w-full"
            />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <p-calendar
                formControlName="fechaNacimiento"
                [showIcon]="true"
                placeholder="Seleccione la fecha"
                class="w-full"
              ></p-calendar>
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <p-dropdown
                [options]="genderOptions"
                optionLabel="label"
                optionValue="value"
                formControlName="sexo"
                placeholder="Seleccione el sexo"
                [showClear]="true"
                class="w-full"
              ></p-dropdown>
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Email</label>
              <input pInputText formControlName="correo" type="email" placeholder="Ingrese el correo electrónico" class="w-full" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input pInputText formControlName="telefono" placeholder="Ingrese el teléfono" class="w-full" />
            </div>
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input pInputText formControlName="domicilio" placeholder="Ingrese la dirección" class="w-full" />
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label>Primer Título</label>
              <input pInputText formControlName="titulo1" placeholder="Ingrese el primer título" class="w-full" />
            </div>
            <div class="form-group">
              <label>Segundo Título</label>
              <input pInputText formControlName="titulo2" placeholder="Ingrese el segundo título" class="w-full" />
            </div>
          </div>

          <div class="form-group">
            <label>Observación</label>
            <textarea pInputTextarea formControlName="observation" placeholder="Ingrese la observación" class="w-full" rows="3"></textarea>
          </div>

          <div class="dialog-footer">
            <button pButton type="button" label="Cancelar" class="p-button-secondary" (click)="onCloseForm()"></button>
            <button pButton type="submit" label="Guardar" class="p-button-success" [disabled]="!teacherForm.valid || isSaving" [loading]="isSaving"></button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
      }

      .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormOpen = false;
  isSaving = false;
  isEditing = false;
  currentTeacherId: string | null = null;

  teacherForm: FormGroup;
  columns: GridColumn[] = [
    { field: 'person.nombres', header: 'Nombre', width: '20%' },
    { field: 'person.apellidos', header: 'Apellido', width: '20%' },
    { field: 'person.correo', header: 'Email', width: '20%' },
    { field: 'titulo1', header: 'Primer Título', width: '20%' },
    { field: 'tipo', header: 'Tipo', width: '20%' },
  ];

  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' },
  ];

  formTitle = 'Nuevo Docente';
  formWidth = '700px';
  currentPage = 1;
  currentSearch = '';

  constructor(
    private fb: FormBuilder,
    private teachersService: TeachersService,
    private toastService: ToastService,
  ) {
    this.teacherForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cedula: ['', [Validators.required]],
      fechaNacimiento: [''],
      sexo: ['', [Validators.required]],
      correo: ['', [Validators.email]],
      telefono: [''],
      domicilio: [''],
      titulo1: [''],
      titulo2: [''],
      aniosApostolado: [0],
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event.globalFilter ?? '').toString();
    this.loadTeachers(page);
  }

  loadTeachers(page: number = 1): void {
    this.isLoading = true;
    this.teachersService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response: any) => {
        this.teachers = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los docentes');
      },
    });
  }

  onOpenForm(): void {
    this.isEditing = false;
    this.currentTeacherId = null;
    this.formTitle = 'Nuevo Docente';
    this.teacherForm.reset();
    this.isFormOpen = true;
  }

  onEdit(teacher: Teacher): void {
    this.isEditing = true;
    this.currentTeacherId = teacher.id;
    this.formTitle = 'Editar Docente';
    this.teacherForm.patchValue({
      nombres: teacher.person?.nombres,
      apellidos: teacher.person?.apellidos,
      cedula: teacher.person?.cedula,
      fechaNacimiento: teacher.person?.fechaNacimiento,
      sexo: teacher.person?.sexo,
      correo: teacher.person?.correo,
      telefono: teacher.person?.telefono,
      domicilio: teacher.person?.domicilio,
      titulo1: teacher.titulo1,
      titulo2: teacher.titulo2,
      aniosApostolado: teacher.aniosApostolado,
    });
    this.isFormOpen = true;
  }

  onCloseForm(): void {
    this.isFormOpen = false;
    this.teacherForm.reset();
  }

  onSubmit(): void {
    if (!this.teacherForm.valid) return;
    this.isSaving = true;
    const data = this.teacherForm.value;

    if (this.isEditing && this.currentTeacherId) {
      this.teachersService.update(this.currentTeacherId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Docente actualizado correctamente');
          this.isFormOpen = false;
          this.loadTeachers(this.currentPage);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar el docente');
        },
      });
    } else {
      this.teachersService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Docente creado correctamente');
          this.isFormOpen = false;
          this.loadTeachers(1);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear el docente');
        },
      });
    }
  }

  onDelete(teacher: Teacher): void {
    this.teachersService.delete(teacher.id).subscribe({
      next: () => {
        this.toastService.success('Docente eliminado correctamente');
        this.loadTeachers(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar el docente');
      },
    });
  }

  onRefresh(): void {
    this.loadTeachers(1);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
