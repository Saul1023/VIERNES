import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io, Socket} from 'socket.io-client'
@Injectable({
    providedIn: 'root',
})
export class SocketClient{
    protected socket :Socket;
    constructor(){
        this.socket = io('http://localhost:88');
    }
    onActualizarPartido(){
        return new Observable( (subr)=>{
            this.socket.on('actualizar-partido',(data:any)=>{
                subr.next(data)
            })
        });
    }
}
