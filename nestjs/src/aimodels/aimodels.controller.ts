import { Controller, Get, Res, Post, Body, UseInterceptors, Param, Delete, UseGuards, HttpException, NotFoundException, HttpStatus, Request, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { AimodelsService } from './aimodels.service';
import { CreateAimodelDto } from './dto';
import { Aimodel } from "./aimodels.model";
import * as fs from 'fs';

@Controller('aimodels')
export class AimodelsController {
  constructor(private readonly aimodelsService: AimodelsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @UseInterceptors(
    FileInterceptor('file'), 
    FileFieldsInterceptor([
      { name: 'file', maxCount: 1 },
    ])
  )
  @Post()
  async create(@UploadedFile() model) {
    console.log(model);
    // console.log(req);
    // console.log(createAimodelDto);
    // createAimodelDto.made_by = req.id;
    // return await this.aimodelsService.create(createAimodelDto);
  }

  @Get('download/:path')
  seeUploadedFile(@Param('path') path, @Res() res) {
    if (fs.existsSync("./files/models/" + path + ".pt")) {
      return res.sendFile(path + ".pt", { root: './files/models' });
    } else if (fs.existsSync("./files/models/" + path)) {
      return res.sendFile(path, { root: './files/models' });
    }
    throw new NotFoundException({
      message: `Model ${path} not found`
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get()
  async findAll(): Promise<Aimodel[]> {
    return await this.aimodelsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Aimodel> {
    return await this.aimodelsService.findOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not find " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.aimodelsService.deleteOne(id).catch(err => {
      if (err.name === 'CastError')
        err.message = "Could not remove " + id;
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }
}
