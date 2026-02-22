import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CitiesService, ProvincesService, CountriesService } from '@app/services/modules/configuration.service';
import { ToastService } from '@app/services/toast.service';
import { InputSearchComponent } from '@app/shared/components/input-search/input-search.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { City, Province, Country } from '@app/models/configuration.model';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSearchComponent, InputTextModule, ButtonModule, TooltipModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.scss',
})
export class CityFormComponent implements OnInit {
  cityForm: FormGroup;
  isEditing = false;
  isSaving = false;
  currentCityId: string | null = null;
  selectedCountry: Country | null = null;
  selectedProvince: Province | null = null;
  countries: Country[] = [];
  provinces: Province[] = [];
  filteredProvinces: Province[] = [];

  constructor(
    private fb: FormBuilder,
    private citiesService: CitiesService,
    private provincesService: ProvincesService,
    private countriesService: CountriesService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.cityForm = this.fb.group({
      countryId: ['', [Validators.required]],
      provinceId: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    this.loadProvinces();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.currentCityId = id;
      this.loadCity(id);
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

  loadProvinces(): void {
    this.provincesService.getAll(1, 1000).subscribe({
      next: (response) => {
        this.provinces = response.data;
      },
      error: () => {
        this.toastService.error('Error al cargar las provincias');
      },
    });
  }

  onSelectCountry(country: Country): void {
    this.selectedCountry = country;
    this.cityForm.patchValue({ countryId: country.id, provinceId: '' });
    this.selectedProvince = null;
    this.filterProvincesByCountry(country.id);
  }

  filterProvincesByCountry(countryId: string): void {
    this.filteredProvinces = this.provinces.filter(p => p.countryId === countryId);
  }

  onSelectProvince(province: Province): void {
    this.selectedProvince = province;
    this.cityForm.patchValue({ provinceId: province.id });
  }

  loadCity(id: string): void {
    this.citiesService.getById(id).subscribe({
      next: (city: City) => {
        this.selectedProvince = city.province || null;
        if (city.province) {
          this.selectedCountry = city.province.country || null;
          this.filterProvincesByCountry(city.province.countryId);
        }
        this.cityForm.patchValue({
          countryId: city.province?.countryId,
          provinceId: city.provinceId,
          code: city.code,
          name: city.name,
        });
      },
      error: () => {
        this.toastService.error('Error al cargar la ciudad');
        this.location.back();
      },
    });
  }

  onSubmit(): void {
    if (!this.cityForm.valid) {
      return;
    }

    this.isSaving = true;
    const { countryId, ...data } = this.cityForm.value;

    if (this.isEditing && this.currentCityId) {
      this.citiesService.update(this.currentCityId, data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Ciudad actualizada correctamente');
          this.location.back();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al actualizar la ciudad');
        },
      });
    } else {
      this.citiesService.create(data).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.success('Ciudad creada correctamente');
          this.location.back();
        },
        error: () => {
          this.isSaving = false;
          this.toastService.error('Error al crear la ciudad');
        },
      });
    }
  }

  onCancel(): void {
    this.location.back();
  }
}
