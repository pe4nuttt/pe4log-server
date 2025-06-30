import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/auth/guards/jwtGuard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { EUserRole } from 'src/utils/enums';
import { ApiFile } from 'src/utils/decorators/file.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(EUserRole.ADMIN)
  @Post('blog-images/:postId')
  @ApiFile('file', true)
  async uploadBlogImage(
    @Param('postId') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.cloudinaryService.uploadFile(file, {
      folder: `post/${id}/blog-images`,
      transformation: {
        // width: 800,
        // crop: 'fit',
      },
    });
  }
}
