import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { from, switchMap } from 'rxjs';
import { resourceLimits } from 'worker_threads';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  http = inject(HttpClient)
  url = environment.host+'categoria';
  constructor() { }
  getAll(page:number=0,size:number=10,search:string=''){

    return this.http.get(this.url+'/search',{
      params:{
        page:page,
        limit:size,
        search:search
      }
    });
  }
  getOne(id:string){
    return this.http.get(this.url+'/'+id);
  }
  create(item:any){
    return this.http.post(this.url,item)
  }
  edit(id:any,item:any){
    return this.http.put(this.url+'/'+id,item);
  }
  delete(id:any){
    return this.http.delete(this.url+'/'+id);
  }
  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  } 
}
