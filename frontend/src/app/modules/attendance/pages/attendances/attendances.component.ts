import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AttendancesService } from '@app/services/modules/attendance.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { Attendance } from '@app/models/attendance.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, GridSharedComponent, ButtonModule],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Asistencia a Encuentros</h1>
        <app-grid-shared 
          [columns]="columns" 
          [rows]="attendances" 
          [totalRecords]="totalRecords" 
          [pageSize]="pageSize" 
          [isLoading]="isLoading" 
          (add)="onOpenForm()" 
          (edit)="onEdit($event)" 
          (delete)="onDelete($event)" 
          (refresh)="onRefresh()" 
          (export)="onExport()" 
          (lazyLoad)="onLazyLoad($event)"
        >
        </app-grid-shared>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
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
  `],
})
export class AttendancesComponent implements OnInit {
  attendances: Attendance[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;

  columns: GridColumn[] = [
    { field: 'student.person.nombres', header: 'Estudiante', width: '30%' },
    { field: 'encounter.course.grupo', header: 'Grupo', width: '20%' },
    { field: 'encounter.course.paralelo', header: 'Paralelo', width: '20%' },
    { field: 'estado', header: 'Estado', width: '15%' },
    { field: 'observacion', header: 'Observación', width: '15%' },
  ];

  currentPage = 1;
  currentSearch = '';

  constructor(
    private attendancesService: AttendancesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadAttendances();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadAttendances(this.currentPage);
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
    this.loadAttendances(page);
  }

  loadAttendances(page: number = 1): void {
    this.isLoading = true;

    this.attendancesService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.attendances = response.data || [];
        this.totalRecords = response.total || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading attendances:', error);
        this.isLoading = false;
        this.attendances = [];
        this.toastService.error('Error al cargar asistencias. Por favor, intente nuevamente.');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(attendance: Attendance): void {
    this.router.navigate(['edit-single', attendance.id], { relativeTo: this.route });
  }

  onDelete(attendance: Attendance): void {
    this.attendancesService.delete(attendance.id).subscribe({
      next: () => {
        this.toastService.success('Eliminado');
        this.loadAttendances(this.currentPage);
      },
      error: () => this.toastService.error('Error'),
    });
  }

  onRefresh(): void {
    this.loadAttendances(1);
  }

  onExport(): void {
    this.toastService.info('En desarrollo');
  }
}
