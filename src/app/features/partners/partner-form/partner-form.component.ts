import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerService } from '../../../core/services/partner.service';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Partner } from '../../../core/models/partner.model';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../layout/icon/icon.component';
import Save from 'lucide/dist/esm/icons/save.mjs';

/*
 * Partner form component.
 * Provides a reactive form to create and edit partners. In edit mode it
 * loads the existing partner data (converting the Firestore date) and
 * submits create/update operations to the PartnerService.
 */
@Component({
  standalone: true,
  selector: 'app-partner-form',
  imports: [ReactiveFormsModule, GenderPipe, IconComponent],
  templateUrl: './partner-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerFormComponent implements OnInit {
  // Injection of the service and the form
  private partnerService = inject(PartnerService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Reactive form
  public partnerForm!: FormGroup;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

  /* Exposed icon reference for the template. */
  protected readonly Save = Save;

  /* Shortcuts to the form controls used in the template. */
  get nameCtrl() { return this.partnerForm.get('name')!; }
  get emailCtrl() { return this.partnerForm.get('email')!; }
  get genderCtrl() { return this.partnerForm.get('gender')!; }
  get bornDateCtrl() { return this.partnerForm.get('bornDate')!; }

  /*
   * Initializes the form and, when an id is present in the route,
   * switches to edit mode and pre-fills the form with the partner data.
   */
  ngOnInit() {
    // Form initialization
    this.partnerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphoneNumber: [''],
      gender: ['', Validators.required],
      bornDate: ['', Validators.required],
    });
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId) {
      this.isEditMode = true;
      this.partnerService.getPartnerById(this.currentId).then((partner: Partner) => {
        if (partner) {
          this.partnerForm.patchValue({
            ...partner,
            bornDate: partner.bornDate?.toDate().toISOString().substring(0, 10)
          });
        } else {
          console.error('Partner not found.');
        }
      }).catch((error) => {
        console.error('Error connecting to Firestore', error)
      })
    }
  }

  // Helper array for better readability of the genders in the select
  genderOptions = ['MALE', 'FEMALE', 'NON'];

  /*
   * Handles the form submission.
   * Converts the born date into a Date object and either updates the
   * current partner (edit mode) or creates a new one, then redirects
   * back to the partners list.
   */
  async onSubmit() {
    if (this.partnerForm.valid) {
      try {
        const formData = this.partnerForm.value;

        // Reusable conversion
        const [year, month, day] = formData.bornDate.split('-').map(Number);
        const bornDateAsDate = new Date(year, month - 1, day);
        const payload = { ...formData, bornDate: bornDateAsDate };

        if (this.isEditMode) {
          await this.partnerService.updatePartner(this.currentId, payload);
          console.log('Updated.');
        } else {
          const docId = await this.partnerService.createPartner(payload);
          console.log('Created', docId);
        }

        this.toastService.showToast('Socio guardado correctamente.');
        this.partnerForm.reset();
        await this.router.navigate(['/partners']);
      } catch (error) {
        console.error('Problem contacting Firestore:', error);
      }
    } else {
      this.partnerForm.markAllAsTouched();
      console.warn('The form has errors.');
    }
  }
}
