// test/unit/mocks/service-test-helper.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  }),
});

interface ServiceTestOptions<Entity, Service> {
  serviceClass: new (...args: any[]) => Service;
  entityClass: new () => Entity;
  exampleEntity: Entity;
  updatedEntity?: Partial<Entity>;
}

export const testBaseService = async <Entity, Service>({
  serviceClass,
  entityClass,
  exampleEntity,
  updatedEntity,
}: ServiceTestOptions<Entity, Service>) => {
  describe(`${serviceClass.name}`, () => {
    let service: Service;
    const repositoryMock = createMockRepository();

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          serviceClass,
          {
            provide: getRepositoryToken(entityClass),
            useValue: repositoryMock,
          },
        ],
      }).compile();

      service = module.get<Service>(serviceClass);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    // ---------------- findAll ----------------
    describe('findAll', () => {
      it('returns an array of entities', async () => {
        repositoryMock.find.mockResolvedValue([exampleEntity]);
        const result = await (service as any).findAll();
        expect(result).toHaveLength(1);
      });
    });

    // ---------------- findOne ----------------
    describe('findOne', () => {
      it('returns a single entity', async () => {
        repositoryMock.findOne.mockResolvedValue(exampleEntity);
        const result = await (service as any).findOne('1');
        expect(result).toEqual(expect.objectContaining(exampleEntity));
      });

      it('throws NotFoundException if not found', async () => {
        repositoryMock.findOne.mockResolvedValue(null);
        await expect((service as any).findOne('2')).rejects.toThrow(NotFoundException);
      });
    });

    // ---------------- create ----------------
    describe('create', () => {
      it('creates and returns the entity', async () => {
        repositoryMock.create.mockReturnValue(exampleEntity);
        repositoryMock.save.mockResolvedValue(exampleEntity);

        const result = await (service as any).create(exampleEntity);
        expect(result).toEqual(expect.objectContaining(exampleEntity));
        expect(repositoryMock.create).toHaveBeenCalledWith(exampleEntity);
        expect(repositoryMock.save).toHaveBeenCalledWith(exampleEntity);
      });
    });

    // ---------------- update ----------------
    describe('update', () => {
      it('updates and returns the entity', async () => {
        repositoryMock.findOne.mockResolvedValue(exampleEntity);
        repositoryMock.save.mockResolvedValue({ ...exampleEntity, ...updatedEntity });

        const result = await (service as any).update('1', updatedEntity);
        expect(result).toEqual(expect.objectContaining(updatedEntity));
      });

      it('throws NotFoundException if entity not found', async () => {
        repositoryMock.findOne.mockResolvedValue(null);
        await expect((service as any).update('1', updatedEntity)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    // ---------------- delete ----------------
    describe('delete', () => {
      it('deletes the entity', async () => {
        repositoryMock.findOne.mockResolvedValue(exampleEntity);
        repositoryMock.delete.mockResolvedValue({});

        await expect((service as any).delete('1')).resolves.toBeUndefined();
        expect(repositoryMock.delete).toHaveBeenCalledWith({ id: '1' });
      });

      it('throws NotFoundException if entity not found', async () => {
        repositoryMock.findOne.mockResolvedValue(null);
        await expect((service as any).delete('1')).rejects.toThrow(NotFoundException);
      });
    });

    // ---------------- softDelete ----------------
    describe('softDelete', () => {
      it('calls softDelete on repository', async () => {
        repositoryMock.softDelete.mockResolvedValue({});
        await expect((service as any).softDelete('1')).resolves.toBeUndefined();
        expect(repositoryMock.softDelete).toHaveBeenCalledWith('1');
      });
    });

    // ---------------- restore ----------------
    describe('restore', () => {
      it('restores and returns the entity', async () => {
        repositoryMock.restore.mockResolvedValue({});
        repositoryMock.findOne.mockResolvedValue(exampleEntity);

        const result = await (service as any).restore('1');
        expect(result).toEqual(expect.objectContaining(exampleEntity));
        expect(repositoryMock.restore).toHaveBeenCalledWith('1');
      });
    });
  });
};
