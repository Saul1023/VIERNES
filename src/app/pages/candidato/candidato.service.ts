import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { catchError, from, of, repeat, switchMap, tap } from 'rxjs';
import { resourceLimits } from 'worker_threads';
import { AuthService } from '../login/auth.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  http = inject(HttpClient);
  url = environment.host + 'candidatos';

  constructor() {}

  getAll(page: number = 0, size: number = 10, search: string = '') {
    return this.http.get<{
      success: boolean,
      message: string,
      data: {
        item: {
          _id: string,
          nombre: string,
          lema: string,
          foto: string,
          estado: number
        }[],
        total: number
      }
    }>(`${this.url}/search`, {
      params: {
        page: page.toString(),
        limit: size.toString(),
        search
      }
    }).pipe(
      tap(response => console.log('Partidos:', response.data.item)),
      catchError(error => {
        console.error('Error al obtener los candidatos:', error);
        return of({ success: false, message: 'Error', data: { item: [], total: 0 } });
      })
    );
  }

  getOne(id: string) {
    return this.http.get(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener el candidato:', error);
        return of(null);
      })
    );
  }

  create(item: any) {
    item.estado = item.estado || 1;
    return this.http.post(this.url, item).pipe(
      catchError(error => {
        console.error('Error al crear el candidato:', error);
        return of(null);
      })
    );
  }

  edit(id: string, candidato: any) {
    return this.http.put(`http://localhost:3000/candidatos/editar/${id}`, candidato);
  }

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el candidato:', error);
        return of(null);
      })
    );
  }

  habilitar(id: string) {
    return this.http.put(`${this.url}/activar/${id}`, {}).pipe(
      catchError(error => {
        console.error('Error al habilitar el candidato:', error);
        return of(null);
      })
    );
  }
}
