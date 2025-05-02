import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { from, repeat, switchMap, tap } from 'rxjs';
import { resourceLimits } from 'worker_threads';
import { AuthService } from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  http = inject(HttpClient)
  url = environment.host+'candidatos';
  constructor() { }
  getAll(page: number = 0, size: number = 10, search: string = '') {
    console.log('Solicitando candidatos - Página:', page, 'Tamaño:', size, 'Búsqueda:', search);
    return this.http.get(this.url + '/search', {
      params: {
        page: page.toString(),
        limit: size.toString(),
        search: search
      }
    }).pipe(
      tap(response => {
        console.log('Respuesta de la API de candidatos:', response);
      })
    );
  }
  getOne(id:string){
    return this.http.get(this.url+'/'+id).pipe(
      //repeat(3)
    );
  }
  create(item: any) {
    item.estado = item.estado || 1;
    return this.http.post(this.url, item);
  }
  edit(id:any,item:any){
    return this.http.put(this.url+'/'+id,item);
  }
  delete(id:any){
    return this.http.delete(this.url+'/'+id);
  }
  habilitar(id:any){
    return this.http.put(this.url+'/activar/'+id,{});
  }
  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
