import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProvincesService, CountriesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputSearchComponent } from '@app/shared/components/input-search/input-search.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Province, Country } from '@app/models/configuration.model';
import { GridColumn } from '@app/shared/components/grid-shared/grid-shared.component';

@Component({
  selector: 'app-province-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSearchComponent, InputTextModule, ButtonModule],
  templateUrl: './province-form.component.html',
  styleUrl: './province-form.component.scss',
})
export class ProvinceFormComponent implements OnInit {
  provinceForm: FormGroup;
  isEditing = false;
  isSaving = false;
  currentProvinceId: string | null = null;
  selectedCountry: Country | null = null;
  countries: Country[] = [];

  @ViewChild(InputSearchComponent) inputSearchComponent?: InputSearchComponent;

  countryColumns: GridColumn[] = [
    { field: 'name', header: 'Nombre', width: '50%' },
    { field: 'code', header: 'Código', width: '50%' },
  ];

  constructor(
    private fb: FormBuilder,
    private provincesService: ProvincesService,
    private countriesService: CountriesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.provinceForm = this.fb.group({
      countryId: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentProvinceId = id;
      this.loadProvince(id);
    }
  }

  loadCountries(): void {
    this.countriesService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.countries = response.data;
      },
      error: () => {
        this.toastService.error('Error al cargar los países');
      },
    });
  }

  loadProvince(id: string): void {
    this.provincesService.getById(id).subscribe({
      next: (province: Province) => {
        this.selectedCountry = province.country || null;
        this.provinceForm.patchValue({
          countryId: province.countryId,
          code: province.code,
          name: province.name,
        });
        // Actualizar el display del input-search después de que el componente se haya inicializado
        if (province.country) {
          setTimeout(() => {
            this.updateCountryDisplay(province.country!);
          }, 0);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar la provincia');
        this.location.back();
      },
    });
  }

  onSelectCountry(country: Country): void {
    this.selectedCountry = country;
    this.provinceForm.patchValue({ countryId: country.id });
  }

  onClearCountry(): void {
    this.selectedCountry = null;
    this.provinceForm.patchValue({ countryId: '' });
  }

  updateCountryDisplay(country: Country): void {
    if (this.inputSearchComponent) {
      this.inputSearchComponent.setDisplayValue(`${country.code} - ${country.name}`);
    }
  }

  onSubmit(): void {
    if (!this.provinceForm.valid) {
      return;
    }

    this.isSaving = true;
    const data = this.provinceForm.value;

    if (this.isEditing && this.currentProvinceId) {
      this.provincesService.update(this.currentProvinceId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Provincia editada con éxito');
          this.location.back();
        },
        error: (error) => {
          this.isSaving = false;
          const errorMessage = error?.error?.message || error?.message || 'Error al actualizar la provincia';
          this.toastService.error(errorMessage);
        },
      });
    } else {
      this.provincesService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Provincia agregada con éxito');
          this.location.back();
        },
        error: (error) => {
          this.isSaving = false;
          const errorMessage = error?.error?.message || error?.message || 'Error al crear la provincia';
          this.toastService.error(errorMessage);
        },
      });
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
