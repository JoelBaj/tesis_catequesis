import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './services/countries.service';
import { CountriesController } from './controllers/countries.controller';
import { ProvincesService } from './services/provinces.service';
import { ProvincesController } from './controllers/provinces.controller';
import { CitiesService } from './services/cities.service';
import { CitiesController } from './controllers/cities.controller';
import { ParameterTypesService } from './services/parameter-types.service';
import { ParameterTypesController } from './controllers/parameter-types.controller';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { ParameterType } from './entities/parameter-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Province, City, ParameterType])],
  controllers: [
    CountriesController,
    ProvincesController,
    CitiesController,
    ParameterTypesController,
  ],
  providers: [
    CountriesService,
    ProvincesService,
    CitiesService,
    ParameterTypesService,
  ],
  exports: [
    CountriesService,
    ProvincesService,
    CitiesService,
    ParameterTypesService,
  ],
})
export class ConfigurationModule {}
