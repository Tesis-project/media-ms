
import { Injectable, Logger } from '@nestjs/common';
import { _Response_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { Create_Media_Dto } from '@tesis-project/dev-globals/dist/modules/media/dto/create-media.dto';


import { EntityManager } from '@mikro-orm/core';
import { Auth_User_I_Dto } from '@tesis-project/dev-globals/dist/modules/auth/dto';
import { Media_Format_Enum, Media_I, Media_Reference_Enum } from '@tesis-project/dev-globals/dist/modules/media/interfaces';
import { ExceptionsHandler } from '../../../core/helpers';
import { Media_Ety } from '../entities/media.entity';
import { Media_Repository } from '../entities/media.repository.service';
import { RpcException } from '@nestjs/microservices';
import { StorageFile } from '../../../core/classes';
import { Blaze_FileHandlerService } from '.';

import * as uuid from 'uuid';
import { envs } from '../../../core/config/envs';

@Injectable()
export class MediaService {

    private readonly logger = new Logger('MediaService');
    ExceptionsHandler = new ExceptionsHandler();
    service: string = 'MediaService';

    constructor(
        private readonly _Media_Repository: Media_Repository,
        private readonly _Blaze_FileHandlerService: Blaze_FileHandlerService,
        private readonly em: EntityManager
    ) {

    }


    async get_oneFileMeta(_id: string): Promise<_Response_I<Media_I>> {

        let _Response: _Response_I;

        try {

            const file = await this._Media_Repository.findOne(
                {
                    _id: _id
                }
            );

            if (!file) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Archivo media no encontrado',
                    data: null
                }

                throw new RpcException(_Response)
            }

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo encontrado',
                data: {
                    // ...file,
                    _id: file._id,
                    file: file.file,
                    src: envs.blaze_endpoint+ '/' + file.src
                }
            }

        } catch (error) {

            console.log('error', error);

            this.logger.error(`[Get one file meta] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_oneFileMeta`);

        }

        return _Response;

    }

    async get_oneFile(_id: string): Promise<_Response_I> {

        let _Response: _Response_I;

        try {

            const file = await this._Media_Repository.findOne(
                {
                    $or: [
                        {
                            _id: _id
                        },
                        {
                            cloud_file_id: _id
                        }
                    ]
                }
            );

            if (!file) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Archivo media no encontrado',
                    data: null
                }
                     throw new RpcException(_Response)
            }

            const {data} = await this._Blaze_FileHandlerService.get_file(file.cloud_file_id);

            const buffer = data.data;
            const contentType = data.headers['content-type'];
            const file_name: string = file.file;

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo encontrado',
                data: {
                    storageFile: buffer.toString('base64'),
                    contentType: contentType,
                    file: file_name
                }
            }

        } catch (error) {

            console.log('error', error);
            this.logger.error(`[Get one file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.get_oneFile`);

        }

        return _Response;

    }

    async update_single(_id: string, file: Express.Multer.File, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_Ety>> {

        let _Response: _Response_I<Media_Ety>;

        try {

            const f_em = this.em.fork();
            const fileExt = file.mimetype.split('/')[1].toUpperCase();

            const file_media = await this._Media_Repository.findOne(
                {
                    _id: _id,
                    user: user_auth.user
                }
            );

            if (!file_media) {
                _Response =  {
                    ok: false,
                    statusCode: 404,
                    message: 'Archivo media no encontrado',
                    data: null
                }

                throw new RpcException(_Response)
            }

            const updated_file = await this._Blaze_FileHandlerService.process_update(file_media, file);

            const folder: string = `users/${user_auth.user}/`;

            const update_media = await this._Media_Repository.update_media({
                find: file_media,
                update: {
                    file: file.originalname,
                    folder: folder,
                    cloud_file_id: updated_file.data.fileId,
                    src: folder + file.originalname,
                    format: fileExt as Media_Format_Enum,
                    type: file_media.type
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo media actualizado correctamente',
                data: {
                    ...update_media,
                    _id: _id
                }
            }

        } catch (error) {

            this.logger.error(`[Update single file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.update_single`);

        }

        return _Response;

    }

    async delete_single(_id: string, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_Ety>> {

        let _Response: _Response_I<Media_Ety>;

        try {

            const f_em = this.em.fork();

            const file = await this._Media_Repository.findOne(
                {
                    _id: _id,
                    user: user_auth.user
                }
            )

            if (!file) {
                _Response = {
                    ok: false,
                    statusCode: 404,
                    message: 'Archivo media no encontrado',
                    data: null
                }

                     throw new RpcException(_Response)
            }
            const delete_cloud = await this._Blaze_FileHandlerService.process_delete(file.src, file.cloud_file_id);

            const delete_media = await this._Media_Repository.delete_media({
                find: file,
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo media eliminado correctamente',
                data: null
            }

        } catch (error) {

            this.logger.error(`[Delete single file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.delete_single`);

        }

        return _Response;

    }

    async create_single(file: Express.Multer.File, data: Create_Media_Dto, user_auth: Auth_User_I_Dto): Promise<_Response_I<Media_Ety>> {

        let _Response: _Response_I<Media_Ety>;

        try {

            const f_em = this.em.fork();

            const fileExt = file.mimetype.split('/')[1].toUpperCase();

            const folder: string = `users/${user_auth.user}/`;

            const uploaded_file = await this._Blaze_FileHandlerService.process_upload(file, folder);

            const new_file = await this._Media_Repository.create_media({
                save: {
                    format: fileExt as Media_Format_Enum,
                    reference: data.reference,
                    reference_id: data.reference_id,
                    type: data.type,
                    file: file.originalname,
                    folder: folder,
                    cloud_file_id: uploaded_file.data.fileId,
                    src: folder + file.originalname,
                    user: user_auth.user,
                    _id: uuid.v4()
                },
                _em: f_em
            });

            f_em.flush();

            _Response = {
                ok: true,
                statusCode: 201,
                message: 'Archivo creado correctamente',
                data: {
                    ...new_file,
                    _id: new_file._id
                }
            }

        } catch (error) {

            this.logger.error(`[Create single file] Error: ${error}`);
            this.ExceptionsHandler.EmitException(error, `${this.service}.create_single`);

        }

        return _Response as any;

    }


}
