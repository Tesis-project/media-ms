import { Migration } from '@mikro-orm/migrations';

export class Migration20240713225829_setup_media extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media" ("_id" uuid not null default gen_random_uuid(), "file" varchar(255) not null, "folder" varchar(255) not null, "type" text check ("type" in (\'IMAGE\', \'VIDEO\', \'DOCUMENT\')) not null, "format" text check ("format" in (\'JPG\', \'JPEG\', \'PNG\', \'MP4\', \'PDF\', \'DOC\', \'DOCX\')) not null, "src" varchar(255) not null, "reference" text check ("reference" in (\'PROFILE_PROFILE_PIC\', \'PROFILE_COVER_PIC\', \'PROFILE_CREDENTIALS_IDENTITY\', \'PROFILE_CREDENTIALS_PROFESSIONAL\', \'PROFILE_MEDIA_VIDEO_GALLERY\', \'PROFILE_MEDIA_IMAGE_GALLERY\')) not null, "reference_id" varchar(255) not null, "user" varchar(255) not null, "cloud_file_id" varchar(255) null, "updated_at" timestamptz not null default \'2024-07-13 18:58:29\', constraint "media_pkey" primary key ("_id"));');
    this.addSql('alter table "media" add constraint "media_cloud_file_id_unique" unique ("cloud_file_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "media" cascade;');
  }

}
