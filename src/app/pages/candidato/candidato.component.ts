import { Component, computed, inject, OnInit, signal  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { rxResource } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { map } from 'rxjs';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { sign } from 'crypto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CandidatoService } from './candidato.service';
import { FormCandidatoComponent } from './form-candidato/form-candidato.component';
import { CommonModule } from '@angular/common';
import { RxLet } from '@rx-angular/template/let';

export interface Candidato{
    _id?:string,
    nombre?:string,
    apellido?: string,
    biografia?:string,
    puesto?:string,
    fechaNacimiento?:string,
    partidoId?:string,
}
@Component({
  selector: 'app-candidato',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    RxLet

  ],
  templateUrl: './candidato.component.html',
  styleUrl: './candidato.component.css'
})
export class CandidatoComponent{
  constructor() {
  }
  search = new FormControl('');
  searchTerm = signal('')
  searchComp$ =computed(() => this.searchTerm())

  itemService = inject(CandidatoService);
  loading = signal(false);
  isLoading = computed(()=>this.loading());
  dialog = inject(MatDialog);
  item:Candidato= {};
  error = signal<string>('');

  page = signal(0)
  size = signal(10);
  total = signal(0);
  onPageChange(event:PageEvent){
    this.page.set(event.pageIndex);
    this.size.set(event.pageSize);
    this.itemResource.reload()
  }

  buscar(value:Event){
    const input = value.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.page.set(0);
    this.itemResource.reload();
  }

  itemResource = rxResource({
    loader: () => {
      this.loading.set(true);
      console.log('Cargando candidatos...');
      return this.itemService.getAll(
        this.page(), this.size(), this.searchTerm()
      ).pipe(
        map((response: any) => {
          this.loading.set(false);
          this.total.set(response.data.totalCount);  // Usar totalCount en lugar de 'total'
          console.log(response.data.items);  // Acceder a items
          return response.data.items;  // Asegurarte de retornar items
        })
      );
    }
  });
  delete(item:any){
    const confirm = this.dialog.open(DialogConfirmComponent,{})
    confirm.afterClosed().subscribe(resulta=>{
      if(resulta){
        this.itemService.delete(item._id).subscribe(
          (res:any)=>{
            if(res.status=='success')
              this.itemResource.reload();
            else
              this.error.set(res.message);
          }
        );
      }
    })
    this.itemResource.reload();
  }
  habilitar(item:any){
    const confirm = this.dialog.open(DialogConfirmComponent,{})
    confirm.afterClosed().subscribe(resulta=>{
      if(resulta){
        this.itemService.habilitar(item._id).subscribe(
          (res:any)=>{
            if(res.status=='success')
              this.itemResource.reload();
            else
              this.error.set(res.message);
          }
        );
      }
    })
    this.itemResource.reload();
  }
  openDialog(data:any){
    this.item = data;
    const nuevoForm = this.dialog.open(FormCandidatoComponent,{
      data:this.item
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        this.itemResource.reload();
    })
    this.itemResource.reload();
  }
  edit(item:any){
    this.openDialog(item);
  }
  nuevo(){
    this.item={
      _id:'',nombre:'',apellido:'',biografia:'',puesto:'',fechaNacimiento:''
    }
    this.openDialog(this.item);
  }
  convertirFecha(fechaNacimiento: string): string {
    const partes = fechaNacimiento.split('-'); // Dividir la fechaNacimiento por el guion
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Reordenar a YYYY-MM-DD
  }

  // Método para guardar los datos después de convertir la fechaNacimiento
  enviarFormulario() {
    if (this.item.fechaNacimiento) {
      this.item.fechaNacimiento = this.convertirFecha(this.item.fechaNacimiento);
    }

    // Aquí puedes hacer el envío del formulario
    console.log('Formulario enviado:', this.item);
    // Llamar al servicio para guardar la información del candidato
  }
}
