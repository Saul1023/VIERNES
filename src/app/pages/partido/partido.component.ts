import { Component, computed, inject, OnInit, signal  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { rxResource } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { map } from 'rxjs';
import { FormPartidoComponent } from './form-partido/form-partido.component';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { sign } from 'crypto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { PartidoService } from './partido.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { SocketClient } from './socketClient';
export interface Partido{
    _id?:string,
    nombre?:string,
    lema?: string,
    foto?:string,
}
@Component({
  selector: 'app-partido',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent /*implements OnInit */{
  constructor() {
  }
  search = new FormControl('');
  searchTerm = signal('')
  searchComp$ =computed(() => this.searchTerm())

  itemService = inject(PartidoService);
  loading = signal(false);
  isLoading = computed(()=>this.loading());
  dialog = inject(MatDialog);
  item:Partido= {};
  error = signal<string>('');

  page = signal(0)
  size = signal(10);
  total = signal(0);

  socket = inject(SocketClient);
  ngOnInit(): void {
    this.socket.onActualizarPartido().subscribe(dato => {
      console.log('socket: Actualiza datos', dato);
      this.itemResource.reload();
    });
  }

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
    loader:()=>{
      this.loading.set(true);
      return this.itemService.getAll(
        this.page(),this.size(),this.searchTerm())
        .pipe(
        map((response:any)=>{
          this.loading.set(false);
          this.total.set(response.data.total);
          return response.data.item;
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
    const nuevoForm = this.dialog.open(FormPartidoComponent,{
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
      _id:'',nombre:'',lema:'',foto:''
    }
    this.openDialog(this.item);
  }
///PAGINACION

}
