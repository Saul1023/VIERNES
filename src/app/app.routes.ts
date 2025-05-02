import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import path from 'node:path';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('./pages/login/login.component').then(c => c.LoginComponent),
        pathMatch:'full'
    },{
        path:'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        children:[
            {
                path:'producto',
                loadComponent:() => import('./pages/producto/producto.component').then(c =>c.ProductoComponent)
            },{
                path:'usuario',
                loadComponent:() => import('./pages/usuario/usuario.component').then(c => c.UsuarioComponent)
            },{
              path:'partido',
              loadComponent:() => import('./pages/partido/partido.component').then(c => c.PartidoComponent)
            }
            ,{
                path:'unidad',
                loadComponent:() => import('./pages/unidad/unidad.component').then(c => c.UnidadComponent)
            }
            ,{
              path:'candidato',
              loadComponent:() => import('./pages/candidato/candidato.component').then(c => c.CandidatoComponent)
            }
            ,{
                path:'cronograma',
                loadComponent:() => import('./pages/cronograma/cronograma.component').then(c => c.CronogramaComponent)
              }
            ,{
                path:'propuesta',
                loadComponent:() => import('./pages/propuesta/propuesta.component').then(c => c.PropuestaComponent)
            }
        ]
    },{
        path:'**',
        loadComponent:() => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent)
    }
];
/*
ng new ejemplo2
cd ejemplo2
ng g c pages/login
ng g c pages/dashboard
ng g c pages/notfound
**/
