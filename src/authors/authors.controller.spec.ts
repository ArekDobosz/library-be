import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { DatabaseService } from '../database/database.service';

const mockDatabase = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('AuthorsController', () => {
  let controller: AuthorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        AuthorsService,
        { provide: DatabaseService, useValue: mockDatabase },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
