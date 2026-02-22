import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-modal-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('200ms ease-in')
      ]),
      transition('* => void', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" @fadeInOut (click)="onCancel()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button type="button" class="modal-close" (click)="onCancel()" pButton icon="pi pi-times"></button>
        </div>

        <div class="modal-body">
          <div class="modal-message">
            <div class="modal-icon">
              <i [class]="'pi ' + icon"></i>
            </div>
            <div class="modal-text">
              {{ message }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button 
            pButton 
            type="button" 
            label="Cancelar" 
            class="btn-cancel"
            (click)="onCancel()"
          ></button>
          <button 
            pButton 
            type="button" 
            [label]="acceptLabel" 
            class="btn-accept"
            (click)="onAccept()"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .modal-dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-title {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .modal-close {
      background: transparent !important;
      border: none !important;
      color: white !important;
      padding: 8px 12px !important;
      font-size: 1.2rem !important;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-radius: 4px;
      }
    }

    .modal-body {
      padding: 30px;
      flex: 1;
      background: white;
    }

    .modal-message {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .modal-icon {
      font-size: 2.5rem;
      color: #c0392b;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .modal-text {
      font-size: 1rem;
      color: #333;
      line-height: 1.6;
      word-wrap: break-word;
      flex: 1;
    }

    .modal-footer {
      background-color: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      padding: 15px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn-cancel,
    .btn-accept {
      border-radius: 4px !important;
      font-weight: 600 !important;
      padding: 10px 24px !important;
      min-width: 120px !important;
      border: none !important;
    }

    .btn-cancel {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
      color: white !important;

      &:hover {
        background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%) !important;
        color: white !important;
      }
    }

    .btn-accept {
      background: linear-gradient(135deg, #16a085 0%, #1abc9c 100%) !important;
      color: white !important;

      &:hover {
        background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%) !important;
        color: white !important;
      }
    }

    /* Para mensajes de eliminar, cambiar color del botón a rojo */
    .btn-accept.btn-danger {
      background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%) !important;

      &:hover {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
      }
    }
  `]
})
export class ModalConfirmationComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirmación';
  @Input() message = '';
  @Input() icon = 'pi-question-circle';
  @Input() acceptLabel = 'Aceptar';
  @Input() isDanger = false;

  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAccept(): void {
    this.accept.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
