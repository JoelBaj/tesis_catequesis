import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Person } from '@app/models/persons.model';
import { PersonsService } from '@app/services/modules/persons.service';
import { ActivatedRoute, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [
    CommonModule,
    GridSharedComponent,
    RouterOutlet,
  ],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Personas</h1>

        <app-grid-shared
          [columns]="columns"
          [rows]="persons"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
            [globalFilterFields]="globalFilterFields"
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
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  columns: GridColumn[] = [
    { field: 'nombres', header: 'Nombre', width: '15%' },
    { field: 'apellidos', header: 'Apellido', width: '15%' },
    { field: 'cedula', header: 'Cédula', width: '10%' },
    { field: 'correo', header: 'Email', width: '15%' },
    { field: 'fechaNacimiento', header: 'Fecha de Nacimiento', width: '10%' },
    { field: 'sexo', header: 'Género', width: '10%' },
    { field: 'nacionalidad', header: 'Nacionalidad', width: '10%' },
    { field: 'ciudadNacimiento', header: 'Ciudad de Nacimiento', width: '15%' },
  ];

  currentPage = 1;
  currentSearch = '';
    globalFilterFields = ['nombres', 'apellidos', 'correo', 'cedula', 'nacionalidad', 'ciudadNacimiento'];

  constructor(
    protected personsService: PersonsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.loadPersons();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadPersons(this.currentPage);
          }
        });
      });
    
    // Verificar estado inicial
    setTimeout(() => {
      this.hasChildRoute = this.router.url.includes('/add') || this.router.url.includes('/edit');
    });
  }

  onLazyLoad(event: any): void {
    const page = (event.first || 0) / (event.rows || 10) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadPersons(page);
  }

  loadPersons(page: number = 1): void {
    this.isLoading = true;
    this.personsService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response: any) => {
        this.persons = response.data;
        this.totalRecords = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Error al cargar las personas');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(person: Person): void {
    this.router.navigate(['edit', person.id], { relativeTo: this.route });
  }

  onDelete(person: Person): void {
    this.personsService.delete(person.id).subscribe({
      next: () => {
        this.toastService.success('Persona eliminada correctamente');
        this.loadPersons(this.currentPage);
      },
      error: () => {
        this.toastService.error('Error al eliminar la persona');
      },
    });
  }

  onRefresh(): void {
    this.loadPersons(1);
  }

  onExport(): void {
    this.toastService.info('Función de exportación en desarrollo');
  }
}
