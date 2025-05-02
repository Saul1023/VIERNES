import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private url=environment.host+'auth/login';
  constructor() { }
  login(datos:any){
    return this.http.post(this.url,datos);
  }
  logout(){
    localStorage.removeItem('token');
  }
  saveToken(token:string){
    localStorage.setItem('token',token);
  }
  getToken(){
    return localStorage.getItem('token');
  }
}
