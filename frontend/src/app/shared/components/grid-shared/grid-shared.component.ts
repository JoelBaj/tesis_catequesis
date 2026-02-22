import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TableModule,
  Table,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

export interface GridColumn {
  field: string;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  template?: TemplateRef<any>;
}

export interface GridAction {
  label: string;
  icon: string;
  action: (row: any) => void;
  color?: string;
}

export interface PaginationState {
  first: number;
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: number;
  globalFilter?: string;
}

@Component({
  selector: 'app-grid-shared',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ModalConfirmationComponent,
  ],
  templateUrl: './grid-shared.component.html',
  styleUrl: './grid-shared.component.scss',
})
export class GridSharedComponent {
  @Input() columns: GridColumn[] = [];
  @Input() rows: any[] = [];
  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() isLoading = false;
  @Input() globalFilterFields: string[] = [];

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() lazyLoad = new EventEmitter<any>();

  searchTerm = '';
  first = 0;
  showDeleteConfirm = false;
  deleteConfirmRow: any = null;
  selectedRow: any = null;

  onLazyLoad(event: any): void {
    // Emitir con todos los parámetros de paginación, ordenamiento y búsqueda
    this.lazyLoad.emit({
      ...event,
      globalFilter: this.searchTerm
    });
  }

  onAdd(): void {
    this.add.emit();
  }

  onEdit(row: any): void {
    this.edit.emit(row);
  }

  onDeleteConfirm(row: any): void {
    this.deleteConfirmRow = row;
    this.showDeleteConfirm = true;
  }

  onConfirmDelete(): void {
    if (this.deleteConfirmRow) {
      this.delete.emit(this.deleteConfirmRow);
      this.showDeleteConfirm = false;
      this.deleteConfirmRow = null;
    }
  }

  onConfirmCancel(): void {
    this.showDeleteConfirm = false;
    this.deleteConfirmRow = null;
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean' || value === 0 || value === 1;
  }

  isTruthy(value: any): boolean {
    return value === true || value === 1;
  }

  isFalsy(value: any): boolean {
    return value === false || value === 0;
  }

  onRefresh(): void {
    this.refresh.emit();
    this.first = 0;
    this.selectedRow = null;
    this.lazyLoad.emit({
      first: 0,
      rows: this.pageSize,
      globalFilter: this.searchTerm,
    });
  }

  onExport(): void {
    this.export.emit();
  }

  onSearch(): void {
    this.first = 0;
    this.selectedRow = null;
    this.lazyLoad.emit({
      first: 0,
      rows: this.pageSize,
      globalFilter: this.searchTerm
    });
  }

  onRowClick(row: any): void {
    this.selectedRow = row;
  }

  isRowSelected(row: any): boolean {
    return this.selectedRow === row;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined) {
        return undefined;
      }
      return acc[part];
    }, obj);
  }
}