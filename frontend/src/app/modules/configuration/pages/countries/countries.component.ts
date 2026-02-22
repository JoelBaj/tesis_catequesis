import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CountriesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Country } from '@app/models/configuration.model';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, RouterModule, GridSharedComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent implements OnInit, OnDestroy {
  countries: Country[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  private destroy$ = new Subject<void>();

  columns: GridColumn[] = [
    { field: 'code', header: 'Código', width: '50%' },
    { field: 'name', header: 'Nombre', width: '50%' },
  ];

  constructor(
    private countriesService: CountriesService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    // Detectar si hay una ruta hija activa
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.hasChildRoute = this.router.url.includes('/add') || this.router.url.includes('/edit');
        // Recargar grid cuando vuelve de la ruta hija
        if (!this.hasChildRoute) {
          this.loadCountries();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || this.pageSize) + 1;
    this.loadCountries(page, event.globalFilter);
  }

  loadCountries(page: number = 1, search: string = ''): void {
    this.isLoading = true;
    this.countriesService.getAll(page, this.pageSize, search).subscribe({
      next: (response) => {
        this.countries = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Error al cargar los países');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onEdit(country: Country): void {
    this.router.navigate(['edit', country.id], { relativeTo: this.activatedRoute });
  }

  onDelete(country: Country): void {
    this.countriesService.delete(country.id).subscribe({
      next: () => {
        this.toastService.success('País eliminado correctamente');
        this.loadCountries();
      },
      error: () => {
        this.toastService.error('Error al eliminar el país');
      },
    });
  }

  onRefresh(): void {
    this.loadCountries();
  }

  onExport(): void {
    if (this.countries.length === 0) {
      this.toastService.warn('No hay datos para exportar');
      return;
    }

    // Importamos dinamicamente la librería xlsx
    import('xlsx').then(({ utils, write, writeFile }) => {
      const ws = utils.json_to_sheet(
        this.countries.map(country => ({
          'Código': country.code,
          'Nombre': country.name
        }))
      );

      // Ajustar ancho de columnas
      ws['!cols'] = [
        { wch: 12 },
        { wch: 30 }
      ];

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Países');
      writeFile(wb, `paises_${new Date().getTime()}.xlsx`);
      
      this.toastService.success('Datos exportados a Excel correctamente');
    });
  }

  private generateCSV(data: Country[]): string {
    const headers = ['Código', 'Nombre'];
    const rows = data.map(country => [country.code, country.name]);
    
    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ];
    
    return csvRows.join('\n');
  }
}
