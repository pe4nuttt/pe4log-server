import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigAndUrlOptions,
  ImageTransformationAndTagsOptions,
  UploadApiOptions,
} from 'cloudinary';
import { CloudinaryProvider } from './cloudinary.provider';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/utils/types/cloudinary.type';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    options?: UploadApiOptions,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(options, (error, response) => {
          if (error) reject(error);
          resolve(response);
        })
        .end(file.buffer);
    });
  }
}
