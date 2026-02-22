import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService, ToastService],
  template: `
    <p-toast position="top-right"></p-toast>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error {
      background-color: #dc2626 !important;
      border: 1px solid #dc2626 !important;
    }

    :host ::ng-deep .p-toast .p-toast-message-error .p-toast-message-content {
      color: white !important;
    }

    :host ::ng-deep .p-toast .p-toast-message-error .p-toast-summary {
      color: white !important;
    }

    :host ::ng-deep .p-toast .p-toast-message-error .p-toast-detail {
      color: white !important;
    }

    :host ::ng-deep .p-toast .p-toast-message-error .p-toast-close-icon {
      color: white !important;
    }
  `],
})
export class AppComponent {
  title = 'Sistema GCP';
}
