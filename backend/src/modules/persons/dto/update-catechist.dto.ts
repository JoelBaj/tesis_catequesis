import { PartialType } from '@nestjs/swagger';
import { CreateCatechistDto } from './create-catechist.dto';

export class UpdateCatechistDto extends PartialType(CreateCatechistDto) {}
