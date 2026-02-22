import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersService } from '@app/services/modules/users.service';
import { ToastService } from '@app/services/toast.service';
import { GridSharedComponent, GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';
import { User } from '@app/models/users.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GridSharedComponent],
  template: `
    <div class="page-container">
      <div *ngIf="!hasChildRoute" class="list-container">
        <h1>Usuarios</h1>
        <app-grid-shared
          [columns]="columns"
          [rows]="users"
          [totalRecords]="totalRecords"
          [pageSize]="pageSize"
          [isLoading]="isLoading"
          [globalFilterFields]="['nombre', 'correo', 'rol']"
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
    .page-container { display: flex; flex-direction: column; gap: 20px; height: 100%; }
    .list-container { display: flex; flex-direction: column; gap: 20px; flex: 1; overflow: hidden; }
    h1 { color: #333; font-size: 1.8rem; margin: 0; }
  `],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  totalRecords = 0;
  pageSize = 10;
  isLoading = false;
  hasChildRoute = false;
  columns: GridColumn[] = [
    { field: 'nombre', header: 'Usuario', width: '30%' },
    { field: 'correo', header: 'Correo', width: '40%' },
    { field: 'rol', header: 'Rol', width: '30%' },
  ];
  currentPage = 1;
  currentSearch = '';

  constructor(
    private usersService: UsersService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        setTimeout(() => {
          this.hasChildRoute =
            event.urlAfterRedirects.includes('/add') ||
            event.urlAfterRedirects.includes('/edit');
          if (!this.hasChildRoute) {
            this.loadUsers(this.currentPage);
          }
        });
      });

    setTimeout(() => {
      this.hasChildRoute =
        this.router.url.includes('/add') || this.router.url.includes('/edit');
    });
  }

  onLazyLoad(event: any): void {
    const page = Math.floor((event.first || 0) / (event.rows || this.pageSize)) + 1;
    this.currentPage = page;
    this.currentSearch = (event?.globalFilter ?? '').toString();
    this.loadUsers(page);
  }

  loadUsers(page: number = 1): void {
    this.isLoading = true;
    this.usersService.getAll(page, this.pageSize, this.currentSearch).subscribe({
      next: (response) => {
        this.users = response.data || [];
        this.totalRecords = response.total || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err?.message || 'Error al cargar usuarios');
      },
    });
  }

  onOpenForm(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEdit(user: User): void {
    this.router.navigate(['edit', user.id], { relativeTo: this.route });
  }

  onDelete(user: User): void {
    this.usersService.delete(user.id).subscribe({
      next: () => {
        this.toastService.success('Eliminado');
        this.loadUsers(this.currentPage);
      },
      error: (err) => {
        this.toastService.error(err?.message || 'Error al eliminar');
      },
    });
  }

  onRefresh(): void {
    this.loadUsers(1);
  }

  onExport(): void {
    this.toastService.info('En desarrollo');
  }
}
