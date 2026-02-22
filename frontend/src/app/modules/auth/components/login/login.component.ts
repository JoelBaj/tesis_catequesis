import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule],
  providers: [MessageService],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img class="brand-logo" src="assets/images/logo.jpg" alt="Logo parroquia" />
          <h1 class="title">Bienvenido</h1>
          <p class="system-name">Sistema GCP</p>
          <p class="subtitle">Sistema de gestión de catequesis parroquial</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="nombre">Usuario</label>
            <span class="input-wrapper">
              <i class="pi pi-user"></i>
              <input
                pInputText
                id="nombre"
                type="text"
                formControlName="nombre"
                placeholder="Ingrese su usuario"
                class="w-full"
              />
            </span>
            <small class="error" *ngIf="isFieldInvalid('nombre')">
              El usuario es requerido
            </small>
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <span class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                pInputText
                id="contrasena"
                type="password"
                formControlName="contrasena"
                placeholder="Ingrese su contraseña"
                class="w-full"
              />
            </span>
            <small class="error" *ngIf="isFieldInvalid('contrasena')">
              La contraseña es requerida
            </small>
          </div>

          <button
            pButton
            type="submit"
            label="Ingresar"
            class="w-full"
            [disabled]="!loginForm.valid || isLoading"
            [loading]="isLoading"
          ></button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f1f5f9;
        padding: 24px;
      }

      .login-card {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
        padding: 34px 30px;
        width: 100%;
        max-width: 430px;
      }

      .login-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 22px;
      }

      .brand-logo {
        width: 122px;
        height: 122px;
        object-fit: contain;
        margin-bottom: 10px;
      }

      .title {
        text-align: center;
        color: #1e293b;
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
      }

      .system-name {
        margin: 6px 0 0;
        color: #2c3e50;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.4px;
      }

      .subtitle {
        text-align: center;
        color: #64748b;
        margin: 4px 0 0;
        font-size: 0.88rem;
        line-height: 1.4;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 7px;
        color: #334155;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        background: #ffffff;
        border: 1px solid #d0dbe7;
        border-radius: 8px;
        padding: 0 12px;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
      }

      .input-wrapper i {
        color: #64748b;
        font-size: 0.95rem;
        margin-right: 8px;
      }

      .form-group input {
        width: 100%;
        padding: 11px 0;
        border: none;
        background: transparent;
        font-size: 0.95rem;
      }

      .form-group input:focus {
        outline: none;
      }

      .input-wrapper:focus-within {
        border-color: #5dade2;
        box-shadow: 0 0 0 3px rgba(93, 173, 226, 0.15);
      }

      .error {
        color: #c0392b;
        display: block;
        margin-top: 4px;
        font-size: 0.82rem;
      }

      button {
        background: #2563eb !important;
        border: none !important;
        padding: 12px;
        font-weight: 600;
        font-size: 0.98rem;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.25s ease;
      }

      button:hover:not(:disabled) {
        background: #1d4ed8 !important;
        transform: translateY(-1px);
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        .login-card {
          padding: 26px 18px;
        }

        .title {
          font-size: 1.75rem;
        }

        .brand-logo {
          width: 108px;
          height: 108px;
        }

        .system-name,
        .subtitle {
          font-size: 0.86rem;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // 1) si ya hay sesión central, entro
    this.isLoading = true;
    this.authService.me().subscribe((user) => {
      this.isLoading = false;
      if (user) {
        this.router.navigate(['/dashboard']);
      }
      // si no hay sesión, dejo que el usuario presione "Ingresar"
      // (o podrías redirigir automáticamente al login central)
    });
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      nombre: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    // Catequesis no autentica: redirige al login central
    // returnUrl para que luego de loguearse vuelva a catequesis
    this.authService.goToCentralLogin('/catequesis/dashboard');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}