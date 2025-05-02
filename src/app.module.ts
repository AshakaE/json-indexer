import { Module } from '@nestjs/common';
import { AllDocsModule } from './DocsApi/docs.module';
import DatabaseModule from './Database/database.module';
import { IndexerModule } from './Indexer/indexer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AllDocsModule,
    IndexerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
