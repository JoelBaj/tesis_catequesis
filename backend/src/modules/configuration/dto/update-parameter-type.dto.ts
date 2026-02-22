import { PartialType } from '@nestjs/swagger';
import { CreateParameterTypeDto } from './create-parameter-type.dto';

export class UpdateParameterTypeDto extends PartialType(CreateParameterTypeDto) {}
