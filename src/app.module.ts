import { Module } from '@nestjs/common';
import { MIKRO_ORM_MODULE_CONFIG } from './database/mikro-orm.module';
import { MediaModule } from './modules/media/media.module';
@Module({
    imports: [
        MIKRO_ORM_MODULE_CONFIG,
        MediaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
