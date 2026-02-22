import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule, NavigationEnd } from '@angular/router';
import { ParameterTypesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { ParameterType } from '@app/models/configuration.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-parameter-types',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GridSharedComponent,
  ],
  template: `
    <div class="page-container">
      <div *ngIf="!isFormOpen" class="list-container">
        <h1>Tipos de Parámetros</h1>

        <app-grid-shared
          [columns]="columns"
          [rows]="parameterTypes"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
          [globalFilterFields]="['tipos', 'codigo', 'descripcion']"
          (add)="onOpenForm()"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (refresh)="onRefresh()"
          (export)="onExport()"
          (lazyLoad)="onLazyLoad($event)"
        ></app-grid-shared>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;
      }

      .list-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 1;
        overflow: hidden;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
      }
    `,
  ],
})
export class ParameterTypesComponent implements OnInit {
  parameterTypes: ParameterType[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormOpen = false;

  columns: GridColumn[] = [
    { field: 'tipos', header: 'Tipo', width: '20%' },
    { field: 'codigo', header: 'Código', width: '15%' },
    { field: 'descripcion', header: 'Descripción', width: '30%' },
    { field: 'gcp', header: '¿GCP?', width: '10%' },
    { field: 'gsm', header: '¿GSM?', width: '10%' },
    { field: 'cupo', header: 'Cupo', width: '15%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private parameterTypesService: ParameterTypesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadParameterTypes();
    
    // Detectar cambios de ruta para mostrar/ocultar formulario
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.isFormOpen = event.urlAfterRedirects.includes('/add') || event.urlAfterRedirects.includes('/edit');
        });
      });
    
    // Verificar estado inicial
    setTimeout(() => {
      this.isFormOpen = this.router.url.includes('/add') || this.router.url.includes('/edit');
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event.globalFilter ?? '').toString();
    this.loadParameterTypes(page);
  }

  loadParameterTypes(page: number = 1): void {
    this.isLoading = true;
    this.parameterTypesService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.parameterTypes = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los tipos de parámetros');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(parameterType: ParameterType): void {
    this.router.navigate(['edit', parameterType.id], { relativeTo: this.route });
  }

  onDelete(parameterType: ParameterType): void {
    this.parameterTypesService.delete(parameterType.id).subscribe({
      next: () => {
        this.toastService.success('Tipo de parámetro eliminado correctamente');
        this.loadParameterTypes(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar el tipo de parámetro');
      },
    });
  }

  onRefresh(): void {
    this.loadParameterTypes(1);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
