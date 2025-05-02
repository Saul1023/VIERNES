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
import { CandidatoService } from '../candidato.service';
import { Candidato } from '../candidato.component';
import { PartidoService } from '../../partido/partido.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-form-unidad',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './form-candidato.component.html',
  styleUrl: './form-candidato.component.css'
})
//78189313 cbba
export class FormCandidatoComponent {

  constructor() {
    // Cargar los partidos al inicializar el componente
    this.partidoService.getAll(0, 1000).subscribe({
      next: (res: any) => {
        this.partidos.set(res.data || res); // ajusta según la estructura real del backend
      },
      error: (err) => {
        this.showMsg('Error al cargar partidos', StatusMessage.Error);
        console.error('Error al obtener partidos:', err);
      }
    });
  }


  partidoService = inject(PartidoService); // después de inyectar tus servicios
  partidos = signal<{ _id: string, nombre: string }[]>([]);
  private _snackBar = inject(MatSnackBar);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(CandidatoService);
  router = inject(Router);
  msg = signal('');
  readonly item = inject<Candidato>(MAT_DIALOG_DATA);
  //valiar
  form = this.fb.group<{
    nombre: FormControl<string>,
    apellido: FormControl<string>,
    biografia: FormControl<string>,
    puesto: FormControl<string>,
    fechaNacimiento: FormControl<string>, // nuevo campo fechaNacimiento si no lo tienes aún
    partidoId: FormControl<string> // nuevo campo partidoId
  }>({
    nombre: this.fb.control(this.item.nombre ?? '', Validators.required),
    apellido: this.fb.control(this.item.apellido ?? '', Validators.required),
    biografia: this.fb.control(this.item.biografia ?? '', Validators.required),
    puesto: this.fb.control(this.item.puesto ?? '', Validators.required),
    fechaNacimiento: this.fb.control(this.item.fechaNacimiento ?? ''),
    partidoId: this.fb.control(this.item.partidoId ?? '')
  });
  readonly dialog =   inject(MatDialogRef<FormCandidatoComponent>)

  enviar() {
    let itemNew = this.form.getRawValue();
    if (this.item._id) {
      // Editar
      this.itemService.edit(this.item._id, itemNew).subscribe({
        next: (res: any) => {
          if (res.status == "success") {
            this.showMsg('Datos guardados correctamente', StatusMessage.Success, { duration: 4000 });
            this.dialog.close(true);
          } else {
            this.showMsg(res.message, StatusMessage.Error);
            this.msg.set(res.message);
          }
        },
        error: err => {
          this.showMsg(err.error.message, StatusMessage.Error);
          this.msg.set(err.error.message);
        }
      });
    } else {
      // Nuevo
      this.itemService.create(itemNew).subscribe({
        next: (res: any) => {
          if (res.status == "success") {
            this.showMsg('Se guardó los datos!!!', StatusMessage.Success, { duration: 4000 });
            this.dialog.close(true);
          } else {
            this.showMsg(res.message, StatusMessage.Error);
            this.msg.set(res.message);
          }
        },
        error: err => {
          this.showMsg(err.error.message, StatusMessage.Error);
          this.msg.set(err.error.message);
        }
      });
    }
  }
  showMsg(msg:string,status:StatusMessage,optional={}){
    let notificar = this._snackBar.openFromComponent(NotificarComponent,
      optional);
            notificar.instance.msg = msg;
            notificar.instance.estado = status;
  }
}
