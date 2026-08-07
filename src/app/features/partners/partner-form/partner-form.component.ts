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
          this.partnerForm.patchValue(partner);
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
    // Intentamos la creacion del partner con el formulario validado
    if (this.partnerForm.valid) {
      try {
        // Llamada al servicio para crear el partner
        const formData = this.partnerForm.value;

        if (this.isEditMode) {
          // Actualizamos el documento partiendo del id del socio
          await this.partnerService.updatePartner(this.currentId, this.partnerForm.value);
          console.log('Actualizado.')
        } else {
          // Convertimos la fecha de nacimiento de string a Date
          const dateString = formData.bornDate;
          const [year, month, day] = dateString.split('-').map(Number);
          const bornDateAsDate = new Date(year, month - 1, day);

          // Reemplazamos el valor en el payload
          const payload = { ...formData, bornDate: bornDateAsDate };

          const docId = await this.partnerService.createPartner(payload);
          console.log('Creado', docId);
        }
        // Limpiamos el formulario
        this.toastService.showToast('Socio guardado correctamente.');
        this.partnerForm.reset();
        this.router.navigate(['/partners']);
      } catch (error) {
        console.error('Problema al contactar con Firestore:', error);
      }
    } else {
      // Si el formulario no es valido, marcamos todos los campos como tocados para mostrar los errores
      this.partnerForm.markAllAsTouched();
      console.warn('El formulario tiene errores.');
    }
  }
}
