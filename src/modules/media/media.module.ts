import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { NatsModule } from '../../core/transports/nats.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Media_Repository } from './entities/media.repository.service';
import { Media_Ety } from './entities/media.entity';
import { Blaze_FileHandlerService, MediaService } from './services';


@Module({
    controllers: [MediaController],
    providers: [MediaService, Blaze_FileHandlerService, Media_Repository],
    imports: [
        MikroOrmModule.forFeature([
            Media_Ety
        ]),
        NatsModule
    ]
})
export class MediaModule { }
