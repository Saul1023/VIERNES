import { Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificarComponent, StatusMessage } from '../../../shared/notificar/notificar.component';
import { CandidatoService } from '../candidato.service';
import { Candidato } from '../candidato.component';
import { PartidoService } from '../../partido/partido.service';
import { MatSelectModule } from '@angular/material/select';
import { Partido } from '../../partido/partido.component';
@Component({
  selector: 'app-form-unidad',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    MatSnackBarModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './form-candidato.component.html',
  styleUrl: './form-candidato.component.css'
})

export class FormCandidatoComponent {
  partidos: Partido[] = [];
  partidoSeleccionado: string = '';

  partidoService = inject(PartidoService);
  _snackBar = inject(MatSnackBar);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(CandidatoService);
  router = inject(Router);
  msg = signal('');
  readonly item = inject<Candidato>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialogRef<FormCandidatoComponent>);

  form = this.fb.group({
    nombre: this.fb.control(this.item?.nombre ?? '', Validators.required),
    apellido: this.fb.control(this.item?.apellido ?? '', Validators.required),
    biografia: this.fb.control(this.item?.biografia ?? '', Validators.required),
    puesto: this.fb.control(this.item?.puesto ?? '', Validators.required),
    fechaNacimiento: this.fb.control(this.item?.fechaNacimiento ?? ''),
    partidoId: this.fb.control(this.item?.partidoId ?? ''),
    foto: this.fb.control(this.item?.foto ?? '')
  });

  ngOnInit(): void {
    this.partidoService.getAll().subscribe({
      next: (response: any) => {
        console.log('Respuesta del servicio:', response);
        this.partidos = response?.data?.item || response?.item || [];
      },
      error: (err) => {
        console.error('Error al cargar partidos:', err);
        this.showMsg('Error al cargar partidos', StatusMessage.Error);
      }
    });
  }

  enviar() {
    if (this.form.invalid) {
      this.showMsg('Formulario inválido. Complete los campos requeridos.', StatusMessage.Warning);
      return;
    }

    const itemNew = { ...this.form.getRawValue() };

    if (itemNew.fechaNacimiento) {
      itemNew.fechaNacimiento = this.convertirFechaISO(itemNew.fechaNacimiento);
    }

    const esEdicion = !!this.item?._id; // ✅ Asegura booleano
    const operacion = esEdicion
    ? this.itemService.edit(this.item._id!, itemNew)
      : this.itemService.create(itemNew);

    operacion.subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        if (res?.success || res?.status === 'success') {
          this.showMsg(`Candidato ${esEdicion ? 'actualizado' : 'registrado'} correctamente`, StatusMessage.Success, { duration: 4000 });
          this.dialog.close(true);
        } else {
          const message = res?.message || `Error al ${esEdicion ? 'actualizar' : 'registrar'} candidato`;
          this.showMsg(message, StatusMessage.Error);
          this.msg.set(message);
        }
      },
      error: (err) => {
        console.error(`Error al ${esEdicion ? 'actualizar' : 'registrar'} candidato:`, err);
        this.showMsg(`Error al ${esEdicion ? 'actualizar' : 'registrar'} candidato`, StatusMessage.Error);
      }
    });
  }

  showMsg(msg: string, status: StatusMessage, config: any = {}) {
    const notificar = this._snackBar.openFromComponent(NotificarComponent, config);
    notificar.instance.msg = msg;
    notificar.instance.estado = status;
  }

  convertirFechaISO(fecha: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    const partes = fecha.includes('/') ? fecha.split('/') : fecha.split('-');
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return fecha;
  }

  limpiarFormulario() {
    this.form.reset();
    this.partidoSeleccionado = '';
  }
}
