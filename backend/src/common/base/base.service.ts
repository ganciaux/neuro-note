import { Repository, ObjectLiteral, FindOptionsWhere, DeepPartial } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { toDto, toDtoArray } from '../utils/transform-to-dto';
import { CatchTypeOrmError } from '../decorators/catch-typeorm-error.decorator';

export abstract class BaseService<Entity extends ObjectLiteral, ResponseDto, CreateDto, UpdateDto> {
  protected abstract readonly responseDtoClass: new () => ResponseDto;
  protected abstract readonly idKey: keyof Entity;
  protected abstract readonly entityLabel: string;

  constructor(protected readonly repository: Repository<Entity>) {}

  protected async beforeDelete(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async afterDelete(_entity: Entity): Promise<void> {
    return Promise.resolve();
  }

  protected async extendEntity(entity: Entity): Promise<Entity> {
    return Promise.resolve(entity);
  }

  async findAll(): Promise<ResponseDto[]> {
    const entities = await this.repository.find();
    return toDtoArray(this.responseDtoClass, entities);
  }

  async findOne(id: string | number): Promise<ResponseDto> {
    const entity = await this.findRaw(id);
    return toDto(this.responseDtoClass, entity);
  }

  async findOneExtended(id: string | number): Promise<ResponseDto> {
    const entity = await this.findRaw(id);
    const extended = await this.extendEntity(entity);
    return toDto(this.responseDtoClass, extended);
  }

  protected async findRaw(id: string | number): Promise<Entity> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;
    const entity = await this.repository.findOne({ where });
    if (!entity) throw new NotFoundException(`${this.entityLabel} #${id} not found`);
    return entity;
  }

  @CatchTypeOrmError()
  async create(data: CreateDto): Promise<ResponseDto> {
    const entity = this.repository.create(data as unknown as DeepPartial<Entity>);
    const saved = await this.repository.save(entity);
    return toDto(this.responseDtoClass, saved);
  }

  @CatchTypeOrmError()
  async update(id: string | number, data: UpdateDto): Promise<ResponseDto> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;

    const existing = await this.repository.findOne({ where });
    if (!existing) throw new NotFoundException(`${this.entityLabel} #${id} not found`);

    Object.assign(existing, data);
    const saved = await this.repository.save(existing);

    return toDto(this.responseDtoClass, saved);
  }

  @CatchTypeOrmError()
  async remove(id: string | number): Promise<void> {
    const where = { [this.idKey]: id } as FindOptionsWhere<Entity>;
    const existing = await this.repository.findOne({ where });

    if (!existing) throw new NotFoundException(`${this.entityLabel} #${id} not found`);

    await this.beforeDelete(existing);

    await this.repository.delete(where);

    await this.afterDelete(existing);
  }
}
