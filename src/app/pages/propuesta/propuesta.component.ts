import { Component, computed, inject, OnInit, signal  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { UnidadService } from './propuesta.service';
import { rxResource } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { map } from 'rxjs';
import { FormPropuestaComponent } from './form-propuesta/form-propuesta.component';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { sign } from 'crypto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
export interface Propuesta{
    _id?:string,
    titulo?:string,
    descripcion?: string,
    fechaPropuesta?: string
    estado?:boolean,
}
@Component({
  selector: 'app-propuesta',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './propuesta.component.html',
  styleUrl: './propuesta.component.css'
})
export class PropuestaComponent /*implements OnInit */{
  search = new FormControl('');
  searchTerm = signal('');
  searchComp$ = computed(() => this.searchTerm());

  itemService = inject(UnidadService);
  loading = signal(false);
  isLoading = computed(() => this.loading());
  dialog = inject(MatDialog);
  item: Propuesta = {};
  error = signal<string>('');

  page = signal(0);
  size = signal(10);
  total = signal(0);

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.size.set(event.pageSize);
    this.itemResource.reload();
  }

  buscar(value: Event) {
    const input = value.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.page.set(0);
    this.itemResource.reload();
  }

  itemResource = rxResource({
    loader: () => {
      this.loading.set(true);
      return this.itemService
        .getAll(this.page(), this.size(), this.searchTerm())
        .pipe(
          map((response: any) => {
            this.loading.set(false);
            this.total.set(response.data.total);
            console.log(response.data.data);
            return response.data.data;
          })
        );
    },
  });

  // Método trackBy para utilizar en *ngFor
  track(index: number, item: any): string {
    return item._id; // Usamos _id como identificador único
  }

  delete(item: any) {
    const confirm = this.dialog.open(DialogConfirmComponent, {});
    confirm.afterClosed().subscribe((resulta) => {
      if (resulta) {
        this.itemService.delete(item._id).subscribe((res: any) => {
          if (res.status == 'success') this.itemResource.reload();
          else this.error.set(res.message);
        });
      }
    });
    this.itemResource.reload();
  }

  habilitar(item: any) {
    const confirm = this.dialog.open(DialogConfirmComponent, {});
    confirm.afterClosed().subscribe((resulta) => {
      if (resulta) {
        this.itemService.habilitar(item._id).subscribe((res: any) => {
          if (res.status == 'success') this.itemResource.reload();
          else this.error.set(res.message);
        });
      }
    });
    this.itemResource.reload();
  }

  openDialog(data: any) {
    this.item = data;
    const nuevoForm = this.dialog.open(FormPropuestaComponent, {
      data: this.item,
    });
    nuevoForm.afterClosed().subscribe((resulta) => {
      if (resulta) this.itemResource.reload();
    });
    this.itemResource.reload();
  }

  edit(item: any) {
    this.openDialog(item);
  }

  nuevo() {
    this.item = {
      _id: '',
      titulo: '',
      fechaPropuesta: '',
      descripcion: '',
      estado: true,
    };
    this.openDialog(this.item);
  }
}
