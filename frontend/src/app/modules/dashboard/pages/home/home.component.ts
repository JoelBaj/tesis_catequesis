import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <div class="logo-container">
          <img 
            src="assets/images/logo.jpg" 
            alt="Parroquia Eclesiástica María Rosa Mística"
            class="logo-image"
          />
        </div>
        <h1 class="welcome-title">Bienvenido al Sistema de Gestión de Catequesis</h1>
        <p class="welcome-subtitle">Parroquia Eclesiástica María Rosa Mística</p>
        <div class="welcome-description">
          <p>Sistema integral para la administración y gestión de actividades catequéticas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .welcome-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .welcome-content {
      text-align: center;
      max-width: 800px;
      background: white;
      border-radius: 20px;
      padding: 60px 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: fadeIn 0.8s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-container {
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
    }

    .logo-image {
      max-width: 280px;
      width: 100%;
      height: auto;
      border-radius: 50%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }

    .logo-image:hover {
      transform: scale(1.05);
    }

    .welcome-title {
      font-size: 2.5rem;
      color: #333;
      margin: 0 0 20px 0;
      font-weight: 700;
      line-height: 1.2;
    }

    .welcome-subtitle {
      font-size: 1.5rem;
      color: #667eea;
      margin: 0 0 30px 0;
      font-weight: 600;
    }

    .welcome-description {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
    }

    .welcome-description p {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .welcome-content {
        padding: 40px 30px;
      }

      .logo-image {
        max-width: 200px;
      }

      .welcome-title {
        font-size: 1.8rem;
      }

      .welcome-subtitle {
        font-size: 1.2rem;
      }

      .welcome-description p {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .welcome-content {
        padding: 30px 20px;
      }

      .logo-image {
        max-width: 160px;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .welcome-subtitle {
        font-size: 1rem;
      }

      .welcome-description p {
        font-size: 0.95rem;
      }
    }
  `]
})
export class HomeComponent {}
