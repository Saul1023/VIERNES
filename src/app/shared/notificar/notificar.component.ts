import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
export  enum StatusMessage{
  Success,
  Error,
  Warning,
  Info,
  None
}
@Component({
  selector: 'app-notificar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    CommonModule
  ],
  templateUrl: './notificar.component.html',
  styleUrl: './notificar.component.css'
})
export class NotificarComponent {
  StatusMessage = StatusMessage;
  @Input() estado:StatusMessage=StatusMessage.None;// = input<StatusMessage>(StatusMessage.None);
  @Input() msg:string = '';// = input<string>('');
  snackBarRef = inject(MatSnackBarRef);
}
