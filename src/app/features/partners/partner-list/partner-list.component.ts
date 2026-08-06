import { Component, inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { Partner } from '../../../core/models/partner.model';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-partner-list',
  imports: [AsyncPipe, DatePipe, GenderPipe, RouterLink],
  templateUrl: './partner-list.component.html'
})
export class PartnerListComponent implements OnInit {
  // Inyeccion del servicio
  private partnerService = inject(PartnerService);

  // Observable de partners
  public partners$: Observable<Partner[]> | undefined;

  ngOnInit() {
    // Inicializacion
    this.partners$ = this.partnerService.getPartners();
  }

  async deletePartner(id: string) {
    const confirm: boolean = window.confirm('¿Estás seguro de borrar este socio?');

    if (confirm) {
      try {
        this.partnerService.deletePartner(id);
        console.log('Eliminado.');
      } catch (error) {
        console.log('Error al borrar el socio: ', error);
      }
    }
  }
}
