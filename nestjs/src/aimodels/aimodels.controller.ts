import {
  Controller,
  Get,
  Res,
  Post,
  Put,
  Body,
  UseInterceptors,
  Param,
  Delete,
  UseGuards,
  HttpException,
  NotFoundException,
  HttpStatus,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { HasRoles } from '../common/decorators/roles.decorator';
import { AimodelsService } from './aimodels.service';
import { CreateAimodelDto } from './dto';
import { Aimodel } from './aimodels.model';
import * as fs from 'fs';
import { UpdateAimodelDto } from './dto/update-aimodel.dto';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('aimodels')
export class AimodelsController {
  constructor(private readonly aimodelsService: AimodelsService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @HasRoles('moderator')
  // @UseInterceptors(
  //   FileInterceptor('file'),
  //   FileFieldsInterceptor([
  //     { name: 'file', maxCount: 1 },
  //   ])
  // )
  // @Post()
  // async create(@UploadedFile() model) {
  //   console.log(model);
  //   // console.log(req);
  //   // console.log(createAimodelDto);
  //   // createAimodelDto.made_by = req.id;
  //   // return await this.aimodelsService.create(createAimodelDto);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Post()
  async create(@Request() req, @Body() createAimodelDto: CreateAimodelDto) {
    createAimodelDto.made_by = req.user._id;
    return await this.aimodelsService.create(createAimodelDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('weights', {
      limits: { fileSize: 1024 * 1024 * 50 },
      storage: diskStorage({
        destination: function(req, file, cb) {
          const path = join('public', 'files', 'weights', req.params.id);
          if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
          cb(null, path);
        },
        filename: function(req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update(
    @UploadedFile() weights,
    @Param('id') id: string,
    @Body() updateAimodelDto: UpdateAimodelDto,
  ) {
    let remove = false;
    if (weights) {
      if (!updateAimodelDto.weights) updateAimodelDto.weights = [];
      updateAimodelDto.weights.push({
        fileName: weights.originalname,
        filePath: weights.path,
        fileSize: weights.size,
      });
    } else if(updateAimodelDto.weights) {
      remove = true;
    }

    return await this.aimodelsService
      .update(id, updateAimodelDto, remove)
      .catch(err => {
        if (err.name === 'CastError') err.message = 'Could not update ' + id;
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get('download/:path')
  seeUploadedFile(@Param('path') path, @Res() res) {
    if (fs.existsSync('./files/models/' + path + '.pt')) {
      return res.sendFile(path + '.pt', { root: './files/models' });
    } else if (fs.existsSync('./files/models/' + path)) {
      return res.sendFile(path, { root: './files/models' });
    }
    throw new NotFoundException({
      message: `Model ${path} not found`,
    });
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
      if (err.name === 'CastError') err.message = 'Could not find ' + id;
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.aimodelsService.deleteOne(id).catch(err => {
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
