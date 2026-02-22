import { Component, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    TableModule,
    TooltipModule,
  ],
  template: `
    <div class="input-search-container">
      <div class="input-wrapper">
        <input
          pInputText
          type="text"
          [(ngModel)]="selectedDisplay"
          placeholder="{{ placeholder }}"
          [disabled]="disabled"
          readonly
          class="input-search-field"
          [class.disabled]="disabled"
        />
        <button
          pButton
          type="button"
          icon="pi pi-search"
          class="search-button"
          [disabled]="disabled"
          (click)="onOpenModal()"
        ></button>
      </div>
    </div>

    <p-dialog
      [visible]="isModalOpen"
      [modal]="true"
      (onHide)="onCancel()"
      [maximizable]="false"
      [closable]="false"
      [style]="{ width: dialogWidth }"
      [contentStyle]="{ padding: '0' }"
      [showHeader]="false"
    >
      <ng-template pTemplate="header">
        <div class="dialog-header-custom">
          <h2>{{ dialogTitle }}</h2>
          <div class="header-actions">
            <button
              pButton
              type="button"
              icon="pi pi-window-maximize"
              class="header-btn"
              (click)="toggleMaximize()"
            ></button>
            <button
              pButton
              type="button"
              icon="pi pi-times"
              class="header-btn"
              (click)="onCancel()"
            ></button>
          </div>
        </div>
      </ng-template>

      <div class="dialog-header-custom">
        <h2>{{ dialogTitle }}</h2>
        <div class="header-actions">
          <button
            pButton
            type="button"
            icon="pi pi-window-maximize"
            class="header-btn"
            (click)="toggleMaximize()"
          ></button>
          <button
            pButton
            type="button"
            icon="pi pi-times"
            class="header-btn"
            (click)="onCancel()"
          ></button>
        </div>
      </div>

      <div class="search-modal-content">
        <div class="search-header">
          <input
            pInputText
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar..."
            (input)="onFilterData()"
            class="search-input-modal"
          />
          <button
            pButton
            type="button"
            icon="pi pi-search"
            class="search-button-modal"
          ></button>
        </div>

        <p-table
          [value]="filteredData"
          [rows]="10"
          [paginator]="true"
          [globalFilterFields]="searchFields"
          styleClass="p-datatable-striped"
          responsiveLayout="scroll"
          dataKey="id"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 3rem"></th>
              <th *ngFor="let col of displayColumns; let i = index">
                {{ columnHeaders[i] || col }}
              </th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-row let-rowIndex="rowIndex">
            <tr (click)="onSelectRow(row)" [class.row-selected]="selectedRow?.id === row.id" (dblclick)="onConfirmSelection()" class="clickable-row">
              <td>
                <i class="pi" [ngClass]="selectedRow?.id === row.id ? 'pi-check-circle check-icon' : 'pi-circle-off'"></i>
              </td>
              <td *ngFor="let col of displayColumns">
                {{ row[col] }}
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="displayColumns.length" class="text-center">
                No hay registros para mostrar
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <button
            pButton
            type="button"
            label="Cancelar"
            class="p-button-secondary"
            (click)="onCancel()"
          ></button>
          <button
            pButton
            type="button"
            label="Seleccionar"
            class="p-button-success"
            [disabled]="!selectedRow"
            (click)="onConfirmSelection()"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .input-search-container {
        width: 100%;
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: stretch;
        width: 100%;
      }

      .input-search-field {
        flex: 1;
        height: 40px;
        border-radius: 6px 0 0 6px;
        border-right: none !important;
      }

      .input-search-field.disabled {
        background-color: #f5f5f5 !important;
        cursor: not-allowed !important;
        opacity: 0.6;
      }

      .search-button {
        height: 40px;
        width: 40px;
        border-radius: 0 6px 6px 0;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
        border: none !important;
        color: white !important;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .search-button:hover {
        background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .search-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .search-button:focus {
        box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2) !important;
      }

      .search-button:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        pointer-events: none;
      }

      .dialog-header-custom {
        width: 100%;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 20px 24px;
        margin: 0;
        border-radius: 6px 6px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dialog-header-custom h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        flex: 1;
      }

      .header-actions {
        display: flex;
        gap: 8px;
        margin-left: 20px;
      }

      .header-btn {
        width: 32px !important;
        height: 32px !important;
        padding: 0 !important;
        min-width: 32px !important;
        background: rgba(255, 255, 255, 0.2) !important;
        border: none !important;
        border-radius: 4px !important;
        color: white !important;
        transition: all 0.3s !important;
      }

      .header-btn:hover {
        background: rgba(255, 255, 255, 0.3) !important;
      }

      .search-modal-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
      }

      .search-header {
        display: flex;
        gap: 0;
        align-items: stretch;
      }

      .search-input-modal {
        flex: 1;
        height: 40px;
        border-radius: 6px 0 0 6px;
        border: 1px solid #e0e0e0;
        border-right: none;
        padding: 0 12px;
        font-size: 0.95rem;
      }

      .search-input-modal:focus {
        outline: none;
        border-color: #2c3e50;
        box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
      }

      .search-button-modal {
        height: 40px;
        width: 40px;
        min-width: 40px !important;
        padding: 0 !important;
        border-radius: 0 6px 6px 0;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
        border: none !important;
        color: white !important;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .search-button-modal:hover {
        background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .clickable-row {
        cursor: pointer;
      }

      .clickable-row:hover {
        background-color: #cfe9f3 !important;
      }

      .row-selected {
        background-color: #5dade2 !important;
        color: white !important;
      }

      .row-selected:hover {
        background-color: #3498db !important;
      }

      .check-icon {
        color: #27ae60;
        font-size: 1.2rem;
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-top: 1px solid #dee2e6;
        margin: 0;
      }

      .dialog-footer button {
        min-width: 100px;
        height: 40px;
        border-radius: 6px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.3s;
      }

      :host ::ng-deep .p-dialog .p-dialog-header {
        padding: 0 !important;
        border-bottom: none !important;
        background: transparent !important;
        display: none !important;
      }

      :host ::ng-deep .p-dialog .p-dialog-content {
        padding: 0 !important;
      }

      :host ::ng-deep .p-dialog .p-dialog-footer {
        padding: 0 !important;
        border-top: none !important;
      }

      :host ::ng-deep .dialog-footer .p-button-secondary {
        background: #6c757d !important;
        color: white !important;
      }

      :host ::ng-deep .dialog-footer .p-button-secondary:hover {
        background: #5a6268 !important;
      }

      :host ::ng-deep .dialog-footer .p-button-success {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
        color: white !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      :host ::ng-deep .dialog-footer .p-button-success:hover {
        background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      :host ::ng-deep .dialog-footer .p-button-success:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host ::ng-deep .pi-circle-off {
        color: #bdc3c7;
        font-size: 1.2rem;
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        background: #2c3e50 !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 15px 12px !important;
        border: none !important;
        font-size: 0.95rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        height: 50px !important;
        vertical-align: middle !important;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
        transition: background-color 0.2s !important;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 15px 12px !important;
        border-color: #e0e0e0 !important;
        border-bottom: 1px solid #e0e0e0 !important;
        font-size: 0.95rem !important;
        height: 50px !important;
        vertical-align: middle !important;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr:last-child > td {
        border-bottom: none !important;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
        background-color: #cfe9f3 !important;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr.p-highlight {
        background-color: #5dade2 !important;
        color: white !important;
      }

      :host ::ng-deep .p-datatable {
        border: 1px solid #e0e0e0 !important;
        border-radius: 4px !important;
      }
    `,
  ],
})
export class InputSearchComponent {
  @Input() placeholder = 'Seleccione...';
  @Input() data: any[] = [];
  @Input() displayColumns: string[] = [];
  @Input() columnHeaders: string[] = [];
  @Input() searchFields: string[] = [];
  @Input() dialogTitle = 'Seleccionar';
  @Input() dialogWidth = '70%';
  @Input() disabled = false;

  @Output() selected = new EventEmitter<any>();

  isModalOpen = false;
  searchTerm = '';
  selectedDisplay = '';
  filteredData: any[] = [];
  selectedRow: any = null;
  isMaximized = false;

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  onOpenModal(): void {
    this.isModalOpen = true;
    this.searchTerm = '';
    this.selectedRow = null;
    this.filteredData = [...this.data];
  }

  onFilterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter((item) =>
      this.searchFields.some(
        (field) =>
          item[field] && item[field].toString().toLowerCase().includes(searchLower),
      ),
    );
  }

  onSelectRow(row: any): void {
    this.selectedRow = row;
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
    // PrimeNG maneja esto automáticamente con el ícono
  }

  onConfirmSelection(): void {
    if (!this.selectedRow) return;
    
    this.selectedDisplay = this.displayColumns
      .map((col) => this.selectedRow[col])
      .join(' - ');
    this.selected.emit(this.selectedRow);
    this.isModalOpen = false;
    this.selectedRow = null;
  }

  onCancel(): void {
    this.isModalOpen = false;
    this.selectedRow = null;
  }

  setDisplayValue(value: string): void {
    this.selectedDisplay = value;
  }
}
