import { NotFoundException } from '@nestjs/common';
import { UsersController } from '../../../src/modules/users/controllers/users.controller';
import { UsersService } from '../../../src/modules/users/services/users.service';
import { UserFactory } from '../../../src/common/factories/user.factory';
import { FilterUserDto } from '../../../src/modules/users/dto/filter-user.dto';
import { createControllerTestModule } from '../mocks/controller-test-helper';
import { createUsersServiceMock } from '../mocks/user-service.mock';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = createUsersServiceMock();

  beforeEach(async () => {
    controller = await createControllerTestModule(UsersController, UsersService, mockUsersService);
  });

  describe('findBySlug', () => {
    it('should call service and return user DTO', async () => {
      const user = UserFactory.makeResponseDto();
      mockUsersService.findBySlug.mockResolvedValue(user);

      const result = await controller.findBySlug(user.slug);

      expect(mockUsersService.findBySlug).toHaveBeenCalledWith(user.slug);
      expect(result).toEqual(user);
    });

    it('should propagate errors from service', async () => {
      mockUsersService.findBySlug.mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.findBySlug('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchUsers', () => {
    it('should call service and return data with meta', async () => {
      const query: FilterUserDto = { page: 1, limit: 10 };
      const users = [UserFactory.makeResponseDto()];
      const total = 5;
      mockUsersService.search.mockResolvedValue([users, total]);

      const result = await controller.searchUsers(query);

      expect(mockUsersService.search).toHaveBeenCalledWith(query);
      expect(result.data.length).toBe(users.length);
      expect(result.data[0]).toEqual(expect.objectContaining(users[0]));
      expect(result.meta).toEqual({ page: query.page, limit: query.limit, total });
    });
  });
});
