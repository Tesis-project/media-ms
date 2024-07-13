import { Migration } from '@mikro-orm/migrations';

export class Migration20240712214008_setup_media extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media" ("_id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "file" varchar(255) not null, "folder" varchar(255) not null, "type" text check ("type" in (\'IMAGE\', \'VIDEO\', \'DOCUMENT\')) not null, "format" text check ("format" in (\'JPG\', \'PNG\', \'MP4\', \'PDF\', \'DOC\', \'DOCX\')) not null, "reference" text check ("reference" in (\'PROFILE_PROFILE_PIC\', \'PROFILE_COVER_PIC\', \'PROFILE_CREDENTIALS\', \'PROFILE_MEDIA\')) not null, "reference_id" varchar(255) not null, "src" varchar(255) not null, constraint "media_pkey" primary key ("_id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "media" cascade;');
  }

}
