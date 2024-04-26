import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';
import { ArticleQuery } from './dto/article.query';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({
    summary: 'This is used to create an article',
    description: 'This contains the detailed description',
  })
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
  }

  @Get('draft')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get()
  @ApiOperation({ summary: 'Find all published articles' })
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map((article) => new ArticleEntity(article));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  @ApiParam({ name: 'id', description: 'Article id' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() articleQuery: ArticleQuery,
  ) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }
    console.log(typeof articleQuery.published === 'boolean');

    console.log(`The queries: ${JSON.stringify(articleQuery)} `);

    return new ArticleEntity(article);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
