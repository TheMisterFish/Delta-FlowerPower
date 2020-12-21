import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  Param,
  Delete,
  UseGuards,
  HttpException,
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
import { CreateaAimodelWeightsDto } from './dto/create-aimodel-weights.dto';
import { diskStorage } from 'multer';
import { join } from 'path';

function getUniqueFilename(filename, directory, depth = 0) {
  const newFilename = depth > 0 ? `${filename.split('.')[0]}(${depth})${filename.split('.')[1]}` : filename;

  if (fs.existsSync(join(directory, newFilename))) {
    return getUniqueFilename(filename, directory, depth + 1);
  }

  return newFilename;
}

@Controller('aimodels')
export class AimodelsController {
  constructor(private readonly aimodelsService: AimodelsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Post()
  async create(@Request() req, @Body() createAimodelDto: CreateAimodelDto) {
    createAimodelDto.made_by = req.user._id;
    return await this.aimodelsService.create(createAimodelDto);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAimodelDto: UpdateAimodelDto,
  ) {
    return await this.aimodelsService
      .update(id, updateAimodelDto)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('admin')
  @Delete(':id/weights/:weightsid')
  async deleteWeights(
    @Param('id') id: string,
    @Param('weightsid') weightsid: string,
  ) {
    return await this.aimodelsService
      .deleteWeights(id, weightsid)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('moderator')
  @Post(':id/weights')
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
          const path = join('public', 'files', 'weights', req.params.id);
          const filename = getUniqueFilename(file.originalname, path);
          cb(null, filename);
        },
      }),
    }),
  )
  async addWeights(
    @UploadedFile() weights,
    @Param('id') id: string,
    @Body() createAimodelWeightsDto: CreateaAimodelWeightsDto,
  ) {
    console.log(weights);
    createAimodelWeightsDto.weights = {
      fileName: weights.filename,
      filePath: weights.path,
      fileSize: weights.size,
    };

    return await this.aimodelsService
      .createWeights(id, createAimodelWeightsDto)
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

  // @Get('download/:path')
  // seeUploadedFile(@Param('path') path, @Res() res) {
  //   if (fs.existsSync('./files/models/' + path + '.pt')) {
  //     return res.sendFile(path + '.pt', { root: './files/models' });
  //   } else if (fs.existsSync('./files/models/' + path)) {
  //     return res.sendFile(path, { root: './files/models' });
  //   }
  //   throw new NotFoundException({
  //     message: `Model ${path} not found`,
  //   });
  // }
}
