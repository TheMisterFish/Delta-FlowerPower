import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { ResearchesService } from './researches.service';
import { Research } from './researches.model';
import { CreateResearchDto, UpdateResearchDto } from './dto';
import { Roles } from '../common/interfaces/roles.interface';

@Controller('researches')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Roles.researcher)
export class ResearchesController {
  constructor(private readonly researchesService: ResearchesService) {}

  @Post()
  async create(
    @Request() req,
    @Body() dto: CreateResearchDto,
  ): Promise<Research> {
    dto.made_by = req.user;
    return await this.researchesService.create(dto);
  }

  @Get()
  async findAll(): Promise<Research[]> {
    return await this.researchesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Research> {
    return await this.researchesService.findOne(id).catch(err => {
      if (err.name === 'CastError') err.message = 'Could not find ' + id;
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateResearchDto) {
    return await this.researchesService.update(id, dto).catch(err => {
      if (err.name === 'CastError') err.message = 'Could not update ' + id;
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @HasRoles(Roles.admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.researchesService.deleteOne(id).catch(err => {
      if (err.name === 'CastError') err.message = 'Could not remove ' + id;
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
