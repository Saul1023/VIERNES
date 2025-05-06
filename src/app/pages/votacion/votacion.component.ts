import { Component, computed, inject, signal } from '@angular/core';
import { Candidato } from '../candidato/candidato.component';
import { VotacionService } from './votacion.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { DialogConfirmComponent } from '../../shared/dialog-confirm/dialog-confirm.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Votacion {
  _id?: string;
  ci: string;
  fechaVoto: Date;
  presidenteId?: string;
  vicepresidenteId?: string;
  presidente?: Candidato;
  vicepresidente?: Candidato;
  partidoId?: string;
}

@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent {
  itemService = inject(VotacionService);
  dialog = inject(MatDialog);

  ciUsuario = '';
  yaVoto: boolean | null = null;
  error = signal<string>('');
  loading = signal(false);
  isLoading = computed(() => this.loading());

  presidenteSeleccionado: Candidato | null = null;
  vicepresidenteSeleccionado: Candidato | null = null;

  presidentes: Candidato[] = [];
  vicepresidentes: Candidato[] = [];

  verificarCI() {
    if (!this.ciUsuario) {
      this.error.set('Debe ingresar su número de CI');
      return;
    }

    this.loading.set(true);
    this.itemService.verificarSiYaVoto(this.ciUsuario).subscribe({
      next: (res: { yaVoto: boolean }) => {
        this.yaVoto = res.yaVoto;
        this.loading.set(false);

        if (!this.yaVoto) {
          this.cargarCandidatos();
        }
      },
      error: (err) => {
        console.error(err);  // Imprime el error completo
        this.error.set('Error al verificar CI');
        this.loading.set(false);
      }
    });
  }

  cargarCandidatos() {
    this.loading.set(true);
    this.error.set(''); // Limpia errores anteriores

    this.itemService.obtenerCandidatos().subscribe({
      next: (candidatos: Candidato[]) => {
        this.loading.set(false);

        // Verifica que candidatos sea un array antes de usar filter
        if (!Array.isArray(candidatos)) {
          this.error.set('Formato de datos inválido');
          return;
        }

        this.presidentes = candidatos.filter(c =>
          c?.puesto?.toLowerCase() === 'presidente' && c.estado !== 0
        );

        this.vicepresidentes = candidatos.filter(c =>
          c?.puesto?.toLowerCase() === 'vicepresidente' && c.estado !== 0
        );

        if (this.presidentes.length === 0 || this.vicepresidentes.length === 0) {
          this.error.set('No hay candidatos disponibles para votar');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar candidatos');
        console.error('Error completo:', err); // Para depuración
      }
    });
  }

  // Registrar el voto en la base de datos de MongoDB
  realizarVoto() {
    if (!this.presidenteSeleccionado || !this.vicepresidenteSeleccionado) {
      this.error.set('Debe seleccionar un presidente y un vicepresidente');
      return;
    }

    const voto: Votacion = {
      ci: this.ciUsuario,
      presidenteId: this.presidenteSeleccionado?._id,
      vicepresidenteId: this.vicepresidenteSeleccionado?._id,
      fechaVoto: new Date(),
      partidoId: this.presidenteSeleccionado?.partidoId // Ajusta según tu lógica
    };

    this.loading.set(true);

    this.itemService.realizarVoto(voto).subscribe({
      next: () => {
        this.error.set('Voto registrado con éxito');
        this.yaVoto = true;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Error al registrar el voto');
        this.loading.set(false);
      }
    });
  }
}
