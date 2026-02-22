import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProvincesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Province } from '@app/models/configuration.model';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-provinces',
  standalone: true,
  imports: [CommonModule, RouterModule, GridSharedComponent],
  templateUrl: './provinces.component.html',
  styleUrl: './provinces.component.scss',
})
export class ProvincesComponent implements OnInit, OnDestroy {
  provinces: Province[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  private destroy$ = new Subject<void>();

  columns: GridColumn[] = [
    { field: 'code', header: 'Código', width: '20%' },
    { field: 'name', header: 'Nombre', width: '40%' },
    { field: 'country.name', header: 'País', width: '40%' },
  ];

  constructor(
    private provincesService: ProvincesService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.hasChildRoute = this.router.url.includes('/add') || this.router.url.includes('/edit');
        if (!this.hasChildRoute) {
          this.loadProvinces();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || this.pageSize) + 1;
    this.loadProvinces(page, event.globalFilter);
  }

  loadProvinces(page: number = 1, search: string = ''): void {
    this.isLoading = true;
    this.provincesService.getAll(page, this.pageSize, search).subscribe({
      next: (response) => {
        this.provinces = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar las provincias');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onEdit(province: Province): void {
    this.router.navigate(['edit', province.id], { relativeTo: this.activatedRoute });
  }

  onDelete(province: Province): void {
    this.provincesService.delete(province.id).subscribe({
      next: () => {
        this.toastService.success('Provincia eliminada correctamente');
        this.loadProvinces();
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al eliminar la provincia';
        this.toastService.error(errorMessage);
      },
    });
  }

  onRefresh(): void {
    this.loadProvinces();
  }

  onExport(): void {
    if (this.provinces.length === 0) {
      this.toastService.warn('No hay datos para exportar');
      return;
    }

    import('xlsx').then(({ utils, write, writeFile }) => {
      const ws = utils.json_to_sheet(
        this.provinces.map(province => ({
          'Nombre': province.name,
          'País': province.country?.name || ''
        }))
      );

      ws['!cols'] = [
        { wch: 30 },
        { wch: 30 }
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Provincias');
      writeFile(wb, `provincias_${new Date().getTime()}.xlsx`);
      
      this.toastService.success('Datos exportados a Excel correctamente');
    });
  }
}
