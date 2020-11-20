import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpException, HttpStatus, Request } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto, SessionsDto } from "./dto";
import { Session } from "./sessions.model";

@Controller('sessions')
export class SessionsController {

  constructor(private readonly sessionsService: SessionsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Post()
  async create(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    createSessionDto.made_by = req.user._id;
    return await this.sessionsService.create(createSessionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SessionsDto> {
    return await this.sessionsService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return await this.sessionsService.update(id, updateSessionDto).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not update " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.sessionsService.deleteOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not remove " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
