import { Component, computed, inject, OnInit, signal  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ProductoService } from './producto.service';
import { rxResource } from '@angular/core/rxjs-interop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { map } from 'rxjs';
import { FormProductoComponent } from './form-producto/form-producto.component';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { sign } from 'crypto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
export interface Producto{
    _id?:string,
    nombre?:string,
    foto?: string
}
@Component({
  selector: 'app-producto',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent /*implements OnInit */{
  search = new FormControl('');
  searchTerm = signal('')
  searchComp$ =computed(() => this.searchTerm())

  itemService = inject(ProductoService);
  loading = signal(false);
  isLoading = computed(()=>this.loading());
  dialog = inject(MatDialog);
  item:Producto= {};
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
  openDialog(data:any){
    this.item = data;
    const nuevoForm = this.dialog.open(FormProductoComponent,{
      data:this.item
    })
    nuevoForm.afterClosed().subscribe(resulta=>{
      if(resulta)
        //
        this.itemResource.reload();
    })
    this.itemResource.reload();
  }
  edit(item:any){
    this.openDialog(item);
  }
  nuevo(){
    this.item={
      _id:'',nombre:'',foto:''
    }
    this.openDialog(this.item);
  }
}
