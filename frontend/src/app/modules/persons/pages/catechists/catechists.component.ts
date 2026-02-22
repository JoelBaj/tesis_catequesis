import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Catechist } from '@app/models/persons.model';
import { CatechistsService } from '@app/services/modules/persons.service';

@Component({
  selector: 'app-catechists',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GridSharedComponent,
  ],
  template: `
    <div class="page-container">
      <router-outlet />

      <h1 *ngIf="!isFormRoute">Catequistas</h1>

      <app-grid-shared
        *ngIf="!isFormRoute"
        [columns]="columns"
        [rows]="catechists"
        [totalRecords]="totalRecords"
        [pageSize]="pageSize"
        [isLoading]="isLoading"
        [globalFilterFields]="globalFilterFields"
        (add)="onAdd()"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (refresh)="onRefresh()"
        (export)="onExport()"
        (lazyLoad)="onLazyLoad($event)"
      ></app-grid-shared>
    </div>
  `,
  styles: [
    `
      .page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0;
      }

      h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0 0 16px 0;
      }
    `,
  ],
})
export class CatechistsComponent implements OnInit {
  catechists: Catechist[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  isFormRoute = false;

  columns: GridColumn[] = [
    { field: 'person.nombres', header: 'Nombres', width: '15%' },
    { field: 'person.apellidos', header: 'Apellidos', width: '15%' },
    { field: 'person.cedula', header: 'Cédula', width: '12%' },
    { field: 'person.correo', header: 'Email', width: '13%' },
    { field: 'titulo1', header: 'Primer Título', width: '15%' },
    { field: 'titulo2', header: 'Segundo Título', width: '15%' },
    { field: 'aniosApostolado', header: 'Años Apostolado', width: '8%' },
    { field: 'estado', header: 'Estado', width: '7%' },
    { field: 'tipo', header: 'Tipo', width: '7%' },
  ];

  globalFilterFields = [
    'person.nombres',
    'person.apellidos',
    'person.cedula',
    'person.correo',
    'titulo1',
    'titulo2',
    'aniosApostolado',
    'estado',
    'tipo',
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    protected catechistsService: CatechistsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCatechists();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.isFormRoute = this.route.children.length > 0;
        });
      });

    setTimeout(() => {
      this.isFormRoute = this.route.children.length > 0;
    });
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadCatechists(page);
  }

  loadCatechists(page: number = 1): void {
    this.isLoading = true;
    this.catechistsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.catechists = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los catequistas');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(catechist: Catechist): void {
    this.router.navigate(['edit', catechist.id], { relativeTo: this.route });
  }

  onDelete(catechist: Catechist): void {
    this.catechistsService.delete(catechist.id).subscribe({
      next: () => {
        this.toastService.success('Catequista eliminado correctamente');
        this.loadCatechists(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar el catequista');
      },
    });
  }

  onRefresh(): void {
    this.loadCatechists(this.currentPage);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
