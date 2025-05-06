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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SocketClient } from './socketClient';
export interface Candidato{
    _id?:string,
    nombre?:string,
    apellido?: string,
    biografia?:string,
    puesto?:string,
    fechaNacimiento?:string,
    partidoId?:string,
    estado?:number,
    foto?:string,
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
    RxLet,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './candidato.component.html',
  styleUrl: './candidato.component.css'
})
export class CandidatoComponent{

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

  socket = inject(SocketClient);
  ngOnInit(): void {
    this.socket.onActualizarCandidato().subscribe(dato => {
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
    loader: () => {
      this.loading.set(true);
      return this.itemService.getAll(this.page(), this.size(), this.searchTerm()).pipe(
        map((response: any) => {
          this.loading.set(false);
          this.total.set(response.data.totalCount);
          return response.data.items;
        })
      );
    }
  });

  delete(item: any) {
    const confirm = this.dialog.open(DialogConfirmComponent, {});
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.delete(item._id).subscribe((res: any) => {
          if (res.status == 'success') this.itemResource.reload();
          else this.error.set(res.message);
        });
      }
    });
  }

  habilitar(item: any) {
    const confirm = this.dialog.open(DialogConfirmComponent, {});
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.habilitar(item._id).subscribe((res: any) => {
          if (res.status == 'success') this.itemResource.reload();
          else this.error.set(res.message);
        });
      }
    });
  }

  openDialog(data: any) {
    if (data.fechaNacimiento) {
      data.fechaNacimiento = this.convertirFecha(data.fechaNacimiento);
    }
    this.item = data;
    const dialogRef = this.dialog.open(FormCandidatoComponent, {
      data: this.item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.itemResource.reload();
    });
  }

  edit(item: any) {
    this.openDialog(item);
  }

  nuevo() {
    this.item = {
      _id: '',
      nombre: '',
      apellido: '',
      biografia: '',
      puesto: '',
      fechaNacimiento: ''
    };
    this.openDialog(this.item);
  }

  convertirFecha(fecha: string): string {
    const date = new Date(fecha);
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : fecha;
  }

}
