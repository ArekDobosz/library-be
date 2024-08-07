import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { DatabaseService } from '../database/database.service';

const authorStub = () => {
  const now = new Date();
  return {
    id: 'b087c732-37ce-4d71-bfc5-519424389fde',
    name: 'John Doe',
    books: [],
    createdAt: now,
    updatedAt: now,
  };
};

const mockDatabase = {
  author: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthorsService', () => {
  let authorsService: AuthorsService;
  let authorsController: AuthorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        AuthorsService,
        { provide: DatabaseService, useValue: mockDatabase },
      ],
    }).compile();

    authorsService = module.get<AuthorsService>(AuthorsService);
    authorsController = module.get<AuthorsController>(AuthorsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authorsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = [authorStub()];

      mockDatabase.author.findMany.mockResolvedValue(result);

      expect(await authorsController.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an author', async () => {
      mockDatabase.author.create.mockResolvedValue(authorStub());

      const author = await authorsController.create({ name: 'John Doe' });

      expect(author.name).toBe('John Doe');
      expect(author.id).toBeDefined();
      expect(author.createdAt).toBeDefined();
      expect(author.updatedAt).toBeDefined();
    });
  });
});
