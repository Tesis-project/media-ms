
import {
    Entity,
    EntityRepositoryType,
    Enum,
    Property
} from "@mikro-orm/core";

import { Schema_key } from "../../../core/entities_global";

import {
    Media_Type_Enum,
    Media_Format_Enum,
    Media_Reference_Enum
} from "@tesis-project/dev-globals/dist/modules/media/interfaces";

import { Media_Repository } from "./media.repository.service";

@Entity({
    tableName: 'media',
    collection: 'media',
    repository: () => Media_Repository
})
export class Media_Ety extends Schema_key {

    [EntityRepositoryType]?: Media_Repository;

    @Property({
        type: 'varchar'
    })
    name: string;

    @Property({
        type: 'varchar'
    })
    file: string;

    @Property({
        type: 'varchar'
    })
    folder: string;

    @Enum({ items: () => Media_Type_Enum })
    @Property()
    type: Media_Type_Enum;

    @Enum({ items: () => Media_Format_Enum })
    @Property()
    format: Media_Format_Enum;

    @Enum({ items: () => Media_Reference_Enum })
    @Property()
    reference: Media_Reference_Enum;

    @Property({
        type: 'varchar'
    })
    reference_id: string;

    @Property({
        type: 'varchar'
    })
    src: string;

}