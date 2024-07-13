import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('createMedia')
  create(@Payload() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }


}
