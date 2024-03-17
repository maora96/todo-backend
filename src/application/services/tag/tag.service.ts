import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/domain/model/Tag/Tag';
import { Repository } from 'typeorm';
import { CreateTagDTO, EditTagDTO } from './dtos';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getMany(userId: string): Promise<Tag[]> {
    return this.tagRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  getOne(id: string): Promise<Tag> {
    return this.tagRepository.findOne({ where: { id } });
  }

  async create(newTag: CreateTagDTO, userId: string): Promise<Tag> {
    const { name } = newTag;

    const tag = new Tag(name, userId, new Date());
    return this.tagRepository.save(tag);
  }

  async edit(id: string, tag: EditTagDTO): Promise<Tag> {
    const existingTag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!existingTag) {
      throw new NotFoundException('Tag not found');
    }

    existingTag.edit(tag);

    return this.tagRepository.save(existingTag);
  }

  async delete(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagRepository.softRemove(tag);
  }
}
