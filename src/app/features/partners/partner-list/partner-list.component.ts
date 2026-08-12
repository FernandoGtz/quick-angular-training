import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { Partner } from '../../../core/models/partner.model';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { TimestampDatePipe } from '../../../core/pipes/timestamp-date.pipe';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../layout/confirm-modal/confirm-modal.component';
import { IconComponent } from '../../../layout/icon/icon.component';
import Pencil from 'lucide/dist/esm/icons/pencil.mjs';
import Trash2 from 'lucide/dist/esm/icons/trash-2.mjs';

/*
 * Partner list component.
 * Displays the active partners in a table using an observable stream,
 * and handles the deletion flow through a confirmation modal, informing
 * the user whether the partner could be removed or is still referenced
 * by trainings.
 */
@Component({
  standalone: true,
  selector: 'app-partner-list',
  imports: [AsyncPipe, DatePipe, GenderPipe, TimestampDatePipe, RouterLink, ConfirmModalComponent, IconComponent],
  templateUrl: './partner-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerListComponent implements OnInit {
  // Service injection
  private partnerService = inject(PartnerService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Observable of partners
  public partners$: Observable<Partner[]> | undefined;
  public isModalOpen: boolean = false;
  public selectedId: string = '';

  /* Exposed icon references for the template. */
  protected readonly icons = { Pencil, Trash2 } as const;

  /* Initializes the observable of partners from the service. */
  ngOnInit() {
    // Initialization
    this.partners$ = this.partnerService.getPartners();
  }

  /*
   * Opens the confirmation modal for the partner selected to be deleted.
   */
  deletePartner(id: string): void {
    this.selectedId = id;
    this.isModalOpen = true;
  }

  /*
   * Executes the deletion of the selected partner.
   * Closes the modal and shows a toast indicating whether the partner
   * was deleted or the operation was blocked by associated trainings.
   */
  async executeDelete() {
    try {
      const result = await this.partnerService.deletePartner(this.selectedId);

      this.isModalOpen = false;
      this.selectedId = '';
      this.cdr.markForCheck();

      if (!result) {
        this.toastService.showToast('Socio eliminado correctamente.');
      } else {
        this.toastService.showToast('No se puede eliminar: el socio tiene entrenamientos asociados.');
      }

      this.selectedId = '';
    } catch (error) {
      console.error('Error deleting the partner:', error);
    }
  }
}
