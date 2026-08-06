import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerService } from '../../../core/services/partner.service';
import { GenderPipe } from '../../../core/pipes/gender.pipe';

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

  // Formulario reactivo
  public partnerForm!: FormGroup;

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

        // Convertimos la fecha de nacimiento de string a Date
        const dateString = formData.bornDate;
        const [year, month, day] = dateString.split('-').map(Number);
        const bornDateAsDate = new Date(year, month - 1, day);

        // Reemplazamos el valor en el payload
        const payload = { ...formData, bornDate: bornDateAsDate };

        const docId = await this.partnerService.createPartner(payload);

        console.log('Creado', docId);
        this.partnerForm.reset();
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
