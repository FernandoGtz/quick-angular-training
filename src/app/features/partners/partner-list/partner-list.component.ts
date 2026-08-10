import { Component, inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { Partner } from '../../../core/models/partner.model';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../layout/confirm-modal/confirm-modal.component.component';

@Component({
  standalone: true,
  selector: 'app-partner-list',
  imports: [AsyncPipe, DatePipe, GenderPipe, RouterLink, ConfirmModalComponent],
  templateUrl: './partner-list.component.html'
})
export class PartnerListComponent implements OnInit {
  // Inyeccion del servicio
  private partnerService = inject(PartnerService);
  private toastService = inject(ToastService);

  // Observable de partners
  public partners$: Observable<Partner[]> | undefined;
  public isModalOpen: boolean = false;
  public selectedId: string = '';

  ngOnInit() {
    // Inicializacion
    this.partners$ = this.partnerService.getPartners();
  }

  deletePartner(id: string): void {
    this.selectedId = id;
    this.isModalOpen = true;
  }

  async executeDelete() {
    try {
      const result = await this.partnerService.deletePartner(this.selectedId);
      this.isModalOpen = false;

      if (!result) {
        this.toastService.showToast('Socio eliminado correctamente.');
      } else {
        this.toastService.showToast('No se puede eliminar: el socio tiene entrenamientos asociados.');
      }

      this.selectedId = '';
    } catch (error) {
      console.error('Error al eliminar el socio:', error);
    }
  }
}
