import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectsService } from '@app/services/modules/academic.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Subject } from '@app/models/academic.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GridSharedComponent, DialogModule, InputTextModule, ButtonModule],
  template: `
    <div class="page-container">
      <h1>Asignaturas</h1>
      <app-grid-shared [columns]="columns" [rows]="subjects" [totalRecords]="totalRecords" [pageSize]="pageSize" [isLoading]="isLoading" [globalFilterFields]="['materia', 'sacramento', 'estado']"
        (add)="onOpenForm()" (edit)="onEdit($event)" (delete)="onDelete($event)" (refresh)="onRefresh()" (export)="onExport()" (lazyLoad)="onLazyLoad($event)">
      </app-grid-shared>
      <p-dialog [visible]="isFormOpen" [modal]="true" [header]="formTitle" [style]="{ width: formWidth }" (onHide)="onCloseForm()">
        <form [formGroup]="subjectForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Materia</label>
            <input pInputText formControlName="materia" placeholder="Ingrese la materia" class="w-full" />
          </div>
          <div class="form-group">
            <label>Sacramento</label>
            <input pInputText formControlName="sacramento" placeholder="Ingrese el sacramento" class="w-full" />
          </div>
          <div class="form-group">
            <label>Prerequisito</label>
            <input pInputText formControlName="prerequisitoId" placeholder="Ingrese el prerequisito" class="w-full" />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <input pInputText formControlName="estado" placeholder="Ingrese el estado" class="w-full" />
          </div>
          <div class="dialog-footer">
            <button pButton type="button" label="Cancelar" class="p-button-secondary" (click)="onCloseForm()"></button>
            <button pButton type="submit" label="Guardar" class="p-button-success" [disabled]="!subjectForm.valid || isSaving" [loading]="isSaving"></button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 20px; }
    h1 { color: #333; font-size: 1.8rem; margin: 0; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `],
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = []; totalRecords = 0; pageSize = 10; isLoading = false; isFormOpen = false; isSaving = false; isEditing = false;
  currentSubjectId: number | null = null;
  subjectForm: FormGroup;
  columns: GridColumn[] = [
    { field: 'materia', header: 'Materia', width: '40%' },
    { field: 'sacramento', header: 'Sacramento', width: '30%' },
    { field: 'estado', header: 'Estado', width: '30%' },
  ];
  formTitle = 'Nueva Asignatura'; formWidth = '500px'; currentPage = 1; currentSearch = '';
  constructor(private fb: FormBuilder, private subjectsService: SubjectsService, private toastService: ToastService) {
    this.subjectForm = this.fb.group({
      materia: ['', [Validators.required]],
      sacramento: ['', [Validators.required]],
      prerequisitoId: [null],
      estado: ['', [Validators.required]],
    });
  }
  ngOnInit(): void { this.loadSubjects(); }
  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadSubjects(page);
  }
  loadSubjects(page: number = 1): void {
    this.isLoading = true;
    this.subjectsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => { this.subjects = response.data; this.totalRecords = response.total; this.isLoading = false; },
      error: () => { this.isLoading = false; this.toastService.error('Error al cargar asignaturas'); }
    });
  }
  onOpenForm(): void { this.isEditing = false; this.currentSubjectId = null; this.formTitle = 'Nueva Asignatura'; this.subjectForm.reset(); this.isFormOpen = true; }
  onEdit(subject: Subject): void { this.isEditing = true; this.currentSubjectId = subject.id; this.formTitle = 'Editar Asignatura'; this.subjectForm.patchValue({ materia: subject.materia, sacramento: subject.sacramento, prerequisitoId: subject.prerequisitoId ?? null, estado: subject.estado }); this.isFormOpen = true; }
  onCloseForm(): void { this.isFormOpen = false; this.subjectForm.reset(); }
  onSubmit(): void {
    if (!this.subjectForm.valid) return;
    this.isSaving = true;
    const data = this.subjectForm.value;
    if (this.isEditing && this.currentSubjectId) {
      this.subjectsService.update(this.currentSubjectId, data).subscribe({
        next: () => { this.isSaving = false; this.toastService.success('Asignatura actualizada'); this.isFormOpen = false; this.loadSubjects(this.currentPage); },
        error: () => { this.isSaving = false; this.toastService.error('Error al actualizar'); }
      });
    } else {
      this.subjectsService.create(data).subscribe({
        next: () => { this.isSaving = false; this.toastService.success('Asignatura creada'); this.isFormOpen = false; this.loadSubjects(1); },
        error: () => { this.isSaving = false; this.toastService.error('Error al crear'); }
      });
    }
  }
  onDelete(subject: Subject): void { this.subjectsService.delete(subject.id).subscribe({ next: () => { this.toastService.success('Asignatura eliminada'); this.loadSubjects(this.currentPage); }, error: () => this.toastService.error('Error al eliminar') }); }
  onRefresh(): void { this.loadSubjects(1); }
  onExport(): void { this.toastService.info('Exportación en desarrollo'); }
}
