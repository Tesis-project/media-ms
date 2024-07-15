import { Controller, ParseUUIDPipe, UploadedFile } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto/create-media.dto';

import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { MediaService } from './services';

@Controller()
export class MediaController {


    constructor(
        private readonly mediaService: MediaService
    ) { }

    @MessagePattern('media.serve.file')
    serveFile(
        @Payload('_id', ParseUUIDPipe) _id: string,
    ) {

        return this.mediaService.get_oneFile(_id);

    }

    @MessagePattern('media.create.single')
    create_single(
        @Payload('file') file: Express.Multer.File,
        @Payload('data') data: Create_Media_Dto,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this.mediaService.create_single(file, data, user_auth);

    }

    @MessagePattern('media.update.single')
    update_single(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('file') file: Express.Multer.File,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this.mediaService.update_single(_id, file, user_auth);

    }

    @MessagePattern('media.delete.single')
    delete_single(
        @Payload('_id', ParseUUIDPipe) _id: string,
        @Payload('user_auth') user_auth: Auth_User_I_Dto
    ) {

        return this.mediaService.delete_single(_id, user_auth);

    }

}
