import { Controller, Get, Query } from '@nestjs/common';
import { AllDocs } from 'src/Database/all-docs.schema';
import { AllDocsService } from './docs.service';
import { SearchCriteria } from './search.decorator';

@Controller('allDocs')
export class AllDocsController {
  constructor(private readonly docsService: AllDocsService) {}

  @Get()
  async searchDocs(
    @SearchCriteria() { filter, sort },
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{ data: AllDocs[]; total: number; page: number; pages: number }> {
    return this.docsService.search(filter, page, limit, sort);
  }
}
