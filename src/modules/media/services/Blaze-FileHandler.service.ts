import { Injectable, Logger } from "@nestjs/common";
import { ExceptionsHandler } from "../../../core/helpers";
import { _Response_I } from "@tesis-project/dev-globals/dist/core/interfaces";
import B2 from 'backblaze-b2';
import { envs } from "../../../core/config/envs";
import { Media_Ety } from "../entities/media.entity";

@Injectable()
export class Blaze_FileHandlerService {
    private readonly logger = new Logger('FileHandlerService');
    private exceptionsHandler = new ExceptionsHandler();
    private service = 'FileHandlerService';
    private b2: B2;

    uploadUrl: any;

    constructor() {
        this.b2 = new B2({
            applicationKeyId: envs.blaze_application_key_id,
            applicationKey: envs.blaze_application_key
        });

        this.init_cloud();

    }

    async init_cloud() {

        await this.b2.authorize();

        this.uploadUrl = await this.b2.getUploadUrl({
            bucketId: envs.blaze_bucket_id,
        });

    }

    async get_file( file_id: string ) {

        let _Response: _Response_I;

        try {

          const response = await this.b2.downloadFileById({
            fileId: file_id,
            responseType: 'arraybuffer'
          });

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo encontrado',
                data: response
            };

        } catch (error) {

            console.error('Error al obtener el archivo en cloud:', error);
            this.logger.error(`[Get file] Error: ${error.message}`);
            this.exceptionsHandler.EmitException(error, `${this.service}.get_file`);

        }
        return _Response;

    }



    async process_delete( file_name: string, file_id: string ): Promise<_Response_I> {

        let _Response: _Response_I;

        try {

            const file = await this.b2.deleteFileVersion({
                fileName: file_name,
                fileId: file_id
            });

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo eliminado correctamente',
                data: {
                    ...file.data
                }
            };

        } catch (error) {

            console.error('Error al eliminar el archivo en cloud:', error);

            this.logger.error(`[Process delete] Error: ${error.message}`);
            this.exceptionsHandler.EmitException(error, `${this.service}.process_delete`);

        }

        return _Response;

    }

    async process_upload(file: Express.Multer.File, folder: string = ''): Promise<_Response_I> {
        let _Response: _Response_I;

        try {

            const buffer = Buffer.from(file.buffer.toString('base64'), 'base64');

            if (!Buffer.isBuffer(buffer)) {
                throw new Error('El archivo no es un Buffer válido');
            }

            const response = await this.b2.uploadFile({
                fileName: `${folder}${file.originalname}`,
                data: buffer,
                uploadUrl: this.uploadUrl.data.uploadUrl,
                uploadAuthToken: this.uploadUrl.data.authorizationToken,
            });

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo subido correctamente',
                data: {
                    ...response.data
                }
            };

        } catch (error) {
            console.error('Error al subir el archivo:', error);

            this.logger.error(`[Process upload] Error: ${error.message}`);
            this.exceptionsHandler.EmitException(error, `${this.service}.process_upload`);

        }

        return _Response;
    }

    async process_update( data_prev: Media_Ety, file: Express.Multer.File ): Promise<_Response_I> {

        let _Response: _Response_I;

        try {

            const buffer = Buffer.from(file.buffer.toString('base64'), 'base64');

            if (!Buffer.isBuffer(buffer)) {
                throw new Error('El archivo no es un Buffer válido');
            }

            const consult_file = await this.b2.getFileInfo({
                fileId: data_prev.cloud_file_id,
            }).catch( error =>  error);

            if(consult_file?.response?.status !== 404) {

                const deleted_prev = await this.process_delete(data_prev.src, data_prev.cloud_file_id);

            }

            const response = await this.b2.uploadFile({
                fileName: `${data_prev.folder}${file.originalname}`,
                data: buffer,
                uploadUrl: this.uploadUrl.data.uploadUrl,
                uploadAuthToken: this.uploadUrl.data.authorizationToken,
            });

            _Response = {
                ok: true,
                statusCode: 200,
                message: 'Archivo actualizado correctamente',
                data: {
                    ...response.data
                }
            };

        } catch (error) {

            console.error('Error al subir el archivo:', error);
            this.logger.error(`[Process upload] Error: ${error.message}`);
            this.exceptionsHandler.EmitException(error, `${this.service}.process_upload`);

        }

        return _Response;

    }

}
