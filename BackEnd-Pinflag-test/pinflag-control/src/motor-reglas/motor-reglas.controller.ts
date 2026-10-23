import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { MotorReglasService } from './motor-reglas.service';
import { CreateMotorReglaDto } from './dto/create-motor-regla.dto';
import { UpdateMotorReglaDto } from './dto/update-motor-regla.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller('motor-reglas')
export class MotorReglasController {
  constructor(private readonly motorReglasService: MotorReglasService) { }

  @Post()
  create(@Body() createMotorReglaDto: CreateMotorReglaDto) {
    return this.motorReglasService.create(createMotorReglaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.motorReglasService.findAll(paginationDto);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMotorReglaDto: UpdateMotorReglaDto) {
    return this.motorReglasService.update(id, updateMotorReglaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.motorReglasService.remove(id);
  }

}
