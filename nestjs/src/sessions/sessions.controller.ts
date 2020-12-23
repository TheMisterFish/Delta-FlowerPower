import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpException, HttpStatus, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from "./dto";
import { Session } from "./sessions.model";
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Roles } from '../common/interfaces/roles.interface';
import * as fs from 'fs';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Roles.researcher)
export class SessionsController {

  constructor(private readonly sessionsService: SessionsService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: { fileSize: 1024 * 1024 * 2000 },
      storage: diskStorage({
        destination: function(req, file, cb) {
          const path = join('public', 'files', 'temp');
          if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
          cb(null, path);
        },
      }),
    }),
  )
  async create(@UploadedFiles() files, @Request() req, @Body() dto: CreateSessionDto) {    
    if(files === undefined) {
      throw new HttpException({
        message: "No files uploaded"
      }, HttpStatus.BAD_REQUEST)
    }
    dto.made_by = req.user;
    return await this.sessionsService.create(dto, files);
  }

  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Session> {
    return await this.sessionsService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: { fileSize: 1024 * 1024 * 2000 },
      storage: diskStorage({
        destination: function(req, file, cb) {
          const path = join('public', 'files', 'researches', req.params.id);
          if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
          cb(null, path);
        },
        filename: function(req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update(@UploadedFiles() files, @Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    //TODO UPDATE FILE PATHS?
    // if(updateSessionDto.results) {
    //   updateSessionDto.results.forEach(r => {
    //     const file = files.find(f => f.originalname === r.file.fileName);
    //     r.file.filePath = file.path;
    //     r.file.fileSize = file.size;
    //   })
    // }

    return await this.sessionsService.update(id, updateSessionDto).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not update " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  @HasRoles(Roles.admin)
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
