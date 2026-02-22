export interface Person {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  domicilio?: string;
  telefono?: string;
  correo?: string;
  ciudadNacimiento?: string;
  localidadNacimiento?: string;
  nacionalidad?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface Student {
  id: string;
  feligresId: number;
  estado: string;
  observacion?: string;
  necesidadEspecial: string;
  email?: string;
  madreId?: number;
  padreId?: number;
  representanteId?: number;
  edad: number;
  padresCasados?: string;
  padresBodaCivil?: string;
  bautizo?: number;
  person?: Person;
  parentName?: string;
  motherName?: string;
  representativeName?: string;
  parentPhone?: string;
}

export interface Catechist {
  id: string;
  feligresId: number;
  nivelId: number;
  titulo1?: string;
  titulo2?: string;
  aniosApostolado: number;
  estado: string;
  tipo: string;
  person?: Person;
}

export interface Teacher {
  id: string;
  personId: number;
  nivelId: number;
  titulo1?: string;
  titulo2?: string;
  aniosApostolado: number;
  estado: string;
  tipo: string;
  person?: Person;
}
