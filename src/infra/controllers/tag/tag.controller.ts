import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { TagService } from 'src/application/services/tag/tag.service';
import { AuthGuard } from '../auth/admin.guard';
import { CreateTagDTO } from './dtos/create-tag.dto';
import { EditTagDTO } from './dtos/edit-tag.dto';

@Controller('/v1/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getMany(@Request() request: any) {
    const userId = request.user.sub;
    const tags = await this.tagService.getMany(userId);
    return { result: tags };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const content = await this.tagService.getOne(id);
    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateTagDTO, @Request() request: any) {
    const userId = request.user.sub;
    const content = await this.tagService.create(body, userId);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditTagDTO) {
    const content = await this.tagService.edit(id, body);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.tagService.delete(id);

    return { result: content };
  }
}
