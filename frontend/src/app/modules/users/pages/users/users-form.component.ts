import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@app/services/modules/users.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    TooltipModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button
          pButton
          type="button"
          icon="pi pi-arrow-left"
          class="p-button-text p-button-secondary header-back-btn"
          (click)="onGoBack()"
          pTooltip="Volver"
          tooltipPosition="right"
        ></button>
        <h1>{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h1>
        <div></div>
      </div>

      <form
        [formGroup]="userForm"
        (ngSubmit)="onSubmit()"
        class="form-content"
        autocomplete="off"
      >
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre de usuario <span class="required">*</span></label>
            <input
              pInputText
              formControlName="nombre"
              placeholder="Ingrese el nombre de usuario"
              class="w-full"
              [attr.autocomplete]="'off'"
            />
            <small class="error" *ngIf="getFieldError('nombre')">
              {{ getFieldError('nombre') }}
            </small>
          </div>

          <div class="form-group">
            <label>Correo <span class="required">*</span></label>
            <input
              pInputText
              formControlName="correo"
              type="email"
              placeholder="Ingrese el correo"
              class="w-full"
              [attr.autocomplete]="'off'"
            />
            <small class="error" *ngIf="getFieldError('correo')">
              {{ getFieldError('correo') }}
            </small>
          </div>

          <div class="form-group">
            <label>Rol <span class="required">*</span></label>
            <p-dropdown
              formControlName="rol"
              [options]="roles"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione el rol"
              class="w-full"
            ></p-dropdown>
            <small class="error" *ngIf="getFieldError('rol')">
              {{ getFieldError('rol') }}
            </small>
          </div>

          <div class="form-group">
            <label>Contraseña <span class="required" *ngIf="!isEditing">*</span></label>
            <input
              pInputText
              formControlName="contrasena"
              type="password"
              placeholder="Ingrese la contraseña"
              class="w-full"
              [attr.autocomplete]="'new-password'"
            />
            <small class="hint" *ngIf="isEditing">
              Deje en blanco si no desea cambiar la contraseña
            </small>
            <small class="error" *ngIf="getFieldError('contrasena')">
              {{ getFieldError('contrasena') }}
            </small>
          </div>
        </div>

        <div class="form-footer">
          <button
            pButton
            type="button"
            label="Regresar"
            class="p-button-secondary"
            (click)="onGoBack()"
          ></button>
          <button
            pButton
            type="submit"
            label="Guardar"
            class="p-button-success"
            [disabled]="!userForm.valid || isSaving"
            [loading]="isSaving"
          ></button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }

      .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 30px;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        gap: 20px;
        flex-shrink: 0;
      }

      .form-header h1 {
        color: #333;
        font-size: 1.8rem;
        margin: 0;
        flex: 1;
        text-align: center;
      }

      .form-header > div:first-child,
      .form-header > div:last-child {
        width: 50px;
        display: flex;
        justify-content: center;
      }

      .header-back-btn {
        background: transparent !important;
        border-color: transparent !important;
        color: #6b7280 !important;
      }

      .header-back-btn .p-button-icon {
        color: #6b7280 !important;
      }

      .form-content {
        flex: 1;
        overflow-y: auto;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        max-width: 900px;
        width: 100%;
        padding: 0;
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        color: #333;
        font-weight: 600;
        font-size: 0.95rem;
      }

      .required {
        color: #ef4444;
      }

      .error {
        color: #d32f2f;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .hint {
        color: #6b7280;
        font-size: 0.85rem;
      }

      .form-footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 20px 30px;
        background: white;
        border-top: 1px solid #e0e0e0;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        width: 100%;
        max-width: 1200px;
      }

      .form-footer button {
        min-width: 130px;
        padding: 10px 20px;
      }

      .w-full {
        width: 100%;
      }

      :host ::ng-deep {
        .p-dropdown,
        .p-inputtext {
          width: 100%;
        }

        .p-dropdown .p-inputtext,
        .p-inputtext {
          height: 44px;
          padding: 12px 14px;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .p-button {
          border-radius: 6px;
        }

        .p-button-secondary {
          background-color: #6b7280;
          border-color: #6b7280;
        }

        .p-button-success {
          background-color: #10b981;
          border-color: #10b981;
        }
      }
    `,
  ],
})
export class UsersFormComponent implements OnInit {
  userForm: FormGroup;
  isSaving = false;
  isEditing = false;
  currentUserId: number | null = null;

  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Coordinador', value: 'coordinador' },
    { label: 'Catequista', value: 'catequista' },
  ];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      contrasena: ['', [Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.currentUserId = parseInt(id, 10);
        this.userForm.get('contrasena')?.clearValidators();
        this.userForm.get('contrasena')?.updateValueAndValidity();
        this.loadUser();
      } else {
        this.isEditing = false;
        this.currentUserId = null;
        this.userForm.reset({
          nombre: '',
          correo: '',
          rol: '',
          contrasena: '',
        });
        this.userForm.markAsPristine();
        this.userForm.markAsUntouched();
        this.userForm.get('contrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('contrasena')?.updateValueAndValidity();
      }
    });
  }

  loadUser(): void {
    if (!this.currentUserId) return;
    const requestedId = this.currentUserId;

    this.usersService.getById(this.currentUserId).subscribe({
      next: (user) => {
        if (!this.isEditing || this.currentUserId !== requestedId) {
          return;
        }
        this.userForm.patchValue({
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar usuario');
        this.onGoBack();
      },
    });
  }

  getFieldError(field: string): string | null {
    const control = this.userForm.get(field);
    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return 'Este campo es requerido';
    if (control.errors?.['email']) return 'Correo no valido';
    if (control.errors?.['minlength']) return 'Minimo 6 caracteres';

    return null;
  }

  onSubmit(): void {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.userForm.value;
    const payload = {
      nombre: formValue.nombre,
      correo: formValue.correo,
      rol: formValue.rol ? formValue.rol.toUpperCase() : undefined,
      contrasena: formValue.contrasena || undefined,
    };

    if (this.isEditing && this.currentUserId) {
      if (!payload.contrasena) {
        delete payload.contrasena;
      }
      this.usersService.update(this.currentUserId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Actualizado');
          this.onGoBack();
        },
        error: (err) => {
          this.isSaving = false;
          this.toastService.error(err?.message || 'Error al actualizar');
        },
      });
      return;
    }

    this.usersService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Creado');
        this.onGoBack();
      },
      error: (err) => {
        this.isSaving = false;
        this.toastService.error(err?.message || 'Error al crear');
      },
    });
  }

  onGoBack(): void {
    this.router.navigate(['/dashboard/users']);
  }
}
