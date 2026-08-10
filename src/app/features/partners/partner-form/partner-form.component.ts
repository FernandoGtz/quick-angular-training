import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerService } from '../../../core/services/partner.service';
import { GenderPipe } from '../../../core/pipes/gender.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Training } from '../../../core/models/training.model';
import { Partner } from '../../../core/models/partner.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-partner-form',
  imports: [ReactiveFormsModule, GenderPipe],
  templateUrl: './partner-form.component.html'
})
export class PartnerFormComponent implements OnInit {
  // Inyeccion del servicio y el formulario
  private partnerService = inject(PartnerService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute)
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Formulario reactivo
  public partnerForm!: FormGroup;
  public currentId: string | null = null;
  public isEditMode: boolean = false;

  // Inicializacion del formulario
  ngOnInit() {
    // Inicializacion del formulario
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
          console.error('Socio no encontrado.');
        }
      }).catch((error) => {
        console.error('Error conectando a firestore', error)
      })
    }
  }

  // Arreglo auxiliar para mejor legibilidad de los generos en el select
  genderOptions = ['MALE', 'FEMALE', 'NON'];

  // Metodo para el envio del formulario
  async onSubmit() {
    if (this.partnerForm.valid) {
      try {
        const formData = this.partnerForm.value;

        // Conversión reutilizable
        const [year, month, day] = formData.bornDate.split('-').map(Number);
        const bornDateAsDate = new Date(year, month - 1, day);
        const payload = { ...formData, bornDate: bornDateAsDate };

        if (this.isEditMode) {
          await this.partnerService.updatePartner(this.currentId, payload); // ← payload, no formData
          console.log('Actualizado.');
        } else {
          const docId = await this.partnerService.createPartner(payload);
          console.log('Creado', docId);
        }

        this.toastService.showToast('Socio guardado correctamente.');
        this.partnerForm.reset();
        await this.router.navigate(['/partners']);
      } catch (error) {
        console.error('Problema al contactar con Firestore:', error);
      }
    } else {
      this.partnerForm.markAllAsTouched();
      console.warn('El formulario tiene errores.');
    }
  }
}
