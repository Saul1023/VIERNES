import { Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { UnidadService } from '../unidad.service';
import { Router } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificarComponent, StatusMessage } from '../../../shared/notificar/notificar.component';
import { Unidad } from '../unidad.component';

@Component({
  selector: 'app-form-unidad',
  imports: [
    MatFormFieldModule,
    MatInputModule,    
    ReactiveFormsModule,
    MatButton,
    MatSnackBarModule
  ],
  templateUrl: './form-unidad.component.html',
  styleUrl: './form-unidad.component.css'
})
//78189313 cbba
export class FormUnidadComponent {
  private _snackBar = inject(MatSnackBar);
  fb = inject(NonNullableFormBuilder);
  itemService = inject(UnidadService);
  router = inject(Router);
  msg = signal('');
  readonly item = inject<Unidad>(MAT_DIALOG_DATA);
  //valiar
  form = this.fb.group<{
    nombre:FormControl<string>,
    abr:FormControl<string>,
    foto:FormControl<string>,
  }>({
    nombre:this.fb.control(this.item.nombre??'',Validators.required),
    abr:this.fb.control(this.item.abr??'',Validators.required),
    foto:this.fb.control(this.item.foto??'',Validators.required),
  });
  readonly dialog =   inject(MatDialogRef<FormUnidadComponent>)

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
