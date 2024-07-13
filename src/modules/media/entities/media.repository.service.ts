import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Pagination_Dto } from '@tesis-project/dev-globals/dist/core/dto';

import { Pagination_I, pagination_meta } from '@tesis-project/dev-globals/dist/core/helpers';
import { _Find_Many_I, _Find_One_I, _Process_Delete_I, _Process_Save_I, _Process_Update_I } from '@tesis-project/dev-globals/dist/core/interfaces';
import { Media_Ety } from './media.entity';


@Injectable()
export class Media_Repository extends EntityRepository<Media_Ety> {


    constructor(
        em: EntityManager,
    ) {
        super(em.fork(), Media_Ety);
    }

    async create_media({ save, _em }: _Process_Save_I<Media_Ety>): Promise<Media_Ety> {

        const new_media = await _em.create(Media_Ety, save);
        await _em.persist(new_media);
        return new_media;

    }

    async find_all({ find, options, _em }: _Find_Many_I<Media_Ety, 'Media_Ety'>, Pagination_Dto?: Pagination_Dto): Promise<Pagination_I<Media_Ety>> {

        if (!Pagination_Dto) {
            return {
                data: await this.find( find, options ),
                meta: null
            };
        }

        const { page, limit } = Pagination_Dto;

        const totalRecords = await _em.count(Media_Ety, find);

        const data = await _em.find(Media_Ety, find, {
            ...options,
            limit,
            offset: (page - 1) * limit,
        });

        const meta: Pagination_I['meta'] = pagination_meta(page, limit, totalRecords);

        return {
            data,
            meta
        }

    }

    async delete_media({ find, _em }: _Process_Delete_I<Media_Ety>): Promise<boolean> {

        const user_find = await this.findOne( find );

        if (!user_find) {
            throw new Error('User not found');
        }

        await _em.nativeDelete(Media_Ety, {
            _id: user_find._id
        });
        return true;

    }

    async update_media({ find, update, _em }: _Process_Update_I<Media_Ety>): Promise<Media_Ety> {

        const user_find = await this.findOne(find );

        if (!user_find) {
            throw new Error('User not found');
        }

        Object.assign(user_find, update);
        await _em.persist(user_find);
        return user_find;

    }


}
