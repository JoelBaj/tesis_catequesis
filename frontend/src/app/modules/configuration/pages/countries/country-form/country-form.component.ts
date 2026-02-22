import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CountriesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Country } from '@app/models/configuration.model';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.scss',
})
export class CountryFormComponent implements OnInit {
  countryForm: FormGroup;
  isEditing = false;
  isSaving = false;
  currentCountryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.countryForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentCountryId = id;
      this.loadCountry(id);
    }
  }

  loadCountry(id: string): void {
    this.countriesService.getById(id).subscribe({
      next: (country: Country) => {
        this.countryForm.patchValue({
          name: country.name,
          code: country.code,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar el país');
        this.location.back();
      },
    });
  }

  onSubmit(): void {
    if (!this.countryForm.valid) {
      return;
    }

    this.isSaving = true;
    const data = this.countryForm.value;

    if (this.isEditing && this.currentCountryId) {
      this.countriesService.update(this.currentCountryId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Registro Editado con éxito');
          this.location.back();
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error capturado:', error);
          const errorMessage = error?.error?.message || error?.message || 'Error al actualizar el país';
          console.log('Mensaje a mostrar:', errorMessage);
          this.toastService.error(errorMessage);
        },
      });
    } else {
      this.countriesService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Registro Agregado con éxito');
          this.location.back();
        },
        error: (error) => {
          this.isSaving = false;
          const errorMessage = error?.error?.message || error?.message || 'Error al crear el país';
          this.toastService.error(errorMessage);
        },
      });
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
