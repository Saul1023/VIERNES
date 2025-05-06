import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Emo } from './emo';
@Injectable({
    providedIn: 'root',
  })
  export class TrolService extends Emo  {

    onListSucursalUpdated(): Observable<any[]> {
      return new Observable((subscriber) => {
        this.socket.on('list-sucursal-updated', (data: any) => {
          subscriber.next(data);
        });
      });
    }
  }
