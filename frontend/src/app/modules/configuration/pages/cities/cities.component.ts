import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CitiesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { City } from '@app/models/configuration.model';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule, RouterModule, GridSharedComponent],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent implements OnInit, OnDestroy {
  cities: City[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  private destroy$ = new Subject<void>();

  columns: GridColumn[] = [
    { field: 'code', header: 'Código', width: '20%' },
    { field: 'name', header: 'Nombre', width: '40%' },
    { field: 'province.name', header: 'Provincia', width: '40%' },
  ];

  constructor(
    private citiesService: CitiesService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.hasChildRoute = this.router.url.includes('/add') || this.router.url.includes('/edit');
        if (!this.hasChildRoute) {
          this.loadCities();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || this.pageSize) + 1;
    this.loadCities(page, event.globalFilter);
  }

  loadCities(page: number = 1, search: string = ''): void {
    this.isLoading = true;
    this.citiesService.getAll(page, this.pageSize, search).subscribe({
      next: (response) => {
        this.cities = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar las ciudades');
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onEdit(city: City): void {
    this.router.navigate(['edit', city.id], { relativeTo: this.activatedRoute });
  }

  onDelete(city: City): void {
    this.citiesService.delete(city.id).subscribe({
      next: () => {
        this.toastService.success('Ciudad eliminada correctamente');
        this.loadCities();
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Error al eliminar la ciudad';
        this.toastService.error(errorMessage);
      },
    });
  }

  onRefresh(): void {
    this.loadCities();
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
