import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [CloudinaryModule],
})
export class FilesModule {}
