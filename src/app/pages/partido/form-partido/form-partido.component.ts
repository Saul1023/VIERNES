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

@Component({
  selector: 'app-form-unidad',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    MatSnackBarModule
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
  }>({
    nombre:this.fb.control(this.item.nombre??'',Validators.required),
    lema:this.fb.control(this.item.lema??'',Validators.required),
  });
  readonly dialog =   inject(MatDialogRef<FormPartidoComponent>)

  enviar(){
    let itemNew =this.form.getRawValue();
    if(this.item._id){
      //editar
      this.itemService.edit(this.item._id,itemNew).subscribe(
        {
          next:(res:any)=>{
            if(res.status=="success"){
              this.showMsg('Datos guardados correctamente',
                StatusMessage.Success,{duration:4000})
              this.dialog.close(true);
            }else{
              this.showMsg(res.message,StatusMessage.Error)
              this.msg.set(res.message)
            }
          },
          error:err=>{
            this.showMsg(err.error.message,StatusMessage.Error)
            this.msg.set(err.error.message)
          }
      })
    }else{
      //nuevo
      this.itemService.create(itemNew).subscribe(
        {
          next:(res:any)=>{
            if(res.status=="success"){
                  this.showMsg('Se guardo los datos!!!',StatusMessage.Success,{
                    duration:4000
                  })
              this.dialog.close(true);
            }else{
              this.showMsg(res.message,StatusMessage.Error)
              this.msg.set(res.message)
            }
          },
          error:err=>{
            this.showMsg(err.error.message,StatusMessage.Error)
            this.msg.set(err.error.message)
          }
      })
    }
  }
  showMsg(msg:string,status:StatusMessage,optional={}){
    let notificar = this._snackBar.openFromComponent(NotificarComponent,
      optional);
            notificar.instance.msg = msg;
            notificar.instance.estado = status;
  }
}
