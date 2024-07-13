import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {


  create(createMediaDto: CreateMediaDto) {
    return 'This action adds a new media';
  }


}
