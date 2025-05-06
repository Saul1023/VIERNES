import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Candidato } from '../candidato/candidato.component';
import { Votacion } from './votacion.component';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  private apiUrl = 'http://localhost:3000/votacion';  // URL base correcta

  constructor(private http: HttpClient) {}

  verificarSiYaVoto(ci: string): Observable<{ yaVoto: boolean }> {
    return this.http.get<{ yaVoto: boolean }>(`${this.apiUrl}/verificar/${ci}`);
  }

  // Obtener los candidatos
// votacion.service.ts
obtenerCandidatos(): Observable<Candidato[]> {
  return this.http.get<Candidato[]>(`${this.apiUrl}/candidatos`).pipe(
    map(response => Array.isArray(response) ? response : []), // Asegura que siempre sea un array
    catchError(error => {
      console.error('Error al obtener candidatos:', error);
      return of([]); // Devuelve array vacío en caso de error
    })
  );
}

  // Registrar el voto
  realizarVoto(voto: Votacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/votaciones`, voto);
  }
}
