import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { IUploadFileOptions } from 'src/utils/interfaces/files.inteface';

@Injectable()
export class FilesService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: Express.Multer.File, options: UploadApiOptions) {
    return await this.cloudinaryService.uploadFile(file, options);
  }
}
