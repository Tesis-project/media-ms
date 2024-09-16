import { Migration } from '@mikro-orm/migrations';

export class Migration20240902143815_addTypeMedia extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "media" drop constraint if exists "media_reference_check";');

    this.addSql('alter table "media" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "media" alter column "updated_at" set default \'2024-09-02 10:38:15\';');
    this.addSql('alter table "media" add constraint "media_reference_check" check("reference" in (\'PROFILE_PROFILE_PIC\', \'PROFILE_COVER_PIC\', \'PROFILE_CREDENTIALS_IDENTITY\', \'PROFILE_CREDENTIALS_PROFESSIONAL\', \'PROFILE_MEDIA_VIDEO_GALLERY\', \'PROFILE_MEDIA_IMAGE_GALLERY\', \'VACANT_PIC\', \'VACANT_CONTRACT_DOCUMENT\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "media" drop constraint if exists "media_reference_check";');

    this.addSql('alter table "media" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "media" alter column "updated_at" set default \'2024-07-13 18:58:29\';');
    this.addSql('alter table "media" add constraint "media_reference_check" check("reference" in (\'PROFILE_PROFILE_PIC\', \'PROFILE_COVER_PIC\', \'PROFILE_CREDENTIALS_IDENTITY\', \'PROFILE_CREDENTIALS_PROFESSIONAL\', \'PROFILE_MEDIA_VIDEO_GALLERY\', \'PROFILE_MEDIA_IMAGE_GALLERY\'));');
  }

}
