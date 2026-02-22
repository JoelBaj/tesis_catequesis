export interface Country {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Province {
  id: string;
  code: string;
  name: string;
  countryId: string;
  country?: Country;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface City {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  province?: Province;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ParameterType {
  id: string;
  tipos: string;
  codigo: string;
  descripcion: string;
  gcp: number;
  gsm: number;
  cupo?: number;
}
