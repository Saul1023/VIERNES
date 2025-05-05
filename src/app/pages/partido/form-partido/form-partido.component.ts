import { Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificarComponent, StatusMessage } from '../../../shared/notificar/notificar.component';
import { PartidoService } from '../partido.service';
import { Partido } from '../partido.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-unidad',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './form-partido.component.html',
  styleUrl: './form-partido.component.css'
})
//78189313 cbba
export class FormPartidoComponent {
  private _snackBar = inject(MatSnackBar);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(PartidoService);
  router = inject(Router);
  msg = signal('');
  readonly item = inject<Partido>(MAT_DIALOG_DATA);
  //valiar
  form = this.fb.group<{
    nombre:FormControl<string>,
    lema:FormControl<string>,
    foto:FormControl<string>
  }>({
    nombre:this.fb.control(this.item.nombre??'',Validators.required),
    lema:this.fb.control(this.item.lema??'',Validators.required),
    foto: this.fb.control(this.item.foto ?? '', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png)$/i)
    ]),
  });
  readonly dialog =   inject(MatDialogRef<FormPartidoComponent>)

  enviar(event: Event) {
    event.preventDefault();  // Evitar que el formulario se envíe por defecto

    let itemNew = this.form.getRawValue();

    if (this.item._id) {

      this.itemService.edit(this.item._id, itemNew).subscribe({
        next: (res: any) => {
          if (res.status === 'Success') {
            this.showMsg('Datos guardados correctamente', StatusMessage.Success, { duration: 2000 });
            this.dialog.close(true);
          } else {
            this.showMsg(res.message, StatusMessage.Error);
            this.msg.set(res.message);
          }
        },
        error: (err) => {
          this.showMsg(err.error.message, StatusMessage.Error);
          this.msg.set(err.error.message);
        }
      });
    }else {
      this.itemService.create(itemNew).subscribe(
        {
          next: (res: any) => {
            if (res.status === 'Success') {
              this.showMsg('Se guardaron los datos!!!', StatusMessage.Success, { duration: 2000 });
              this.dialog.close(true);
            } else {
              this.showMsg(res.message, StatusMessage.Error);
              this.msg.set(res.message);
            }
          },
          error: (err) => {
            this.showMsg(err.error.message, StatusMessage.Error);
            this.msg.set(err.error.message);
          }
        }
      );
    }
  }
  showMsg(msg: string, status: StatusMessage, optional: any = {}) {
    this._snackBar.openFromComponent(NotificarComponent, {
      ...optional,
      data: { msg, estado: status }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({
        foto: file
      });
    }
  }
  limpiar() {
    this.form.reset();
    this.msg.set('');
  }
}
