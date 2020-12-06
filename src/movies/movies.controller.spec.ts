import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/movies (GET)', () => {
    it('should return array', async () => {
      const result: Movie[] = [];
      jest.spyOn(service, 'getAll').mockImplementation(() => result);
      expect(await controller.getAll()).toBe(result);
    });

    it('should return movies', async () => {
      const result: Movie[] = [
        {
          id: 1,
          title: 'test',
          year: 2020,
          genres: ['test'],
        },
      ];
      service.createMovie({
        title: 'test',
        year: 2020,
        genres: ['test'],
      });
      jest.spyOn(service, 'getAll').mockImplementation(() => result);
      expect(await controller.getAll()).toBe(result);
    });
  });

  describe('movies/1 (GET)', () => {
    it('should return a movie', async () => {
      const result: Movie = {
        id: 1,
        title: 'test',
        year: 2020,
        genres: ['test'],
      };
      service.createMovie({
        title: 'test',
        year: 2020,
        genres: ['test'],
      });
      jest.spyOn(service, 'getOne').mockImplementation(() => result);
      expect(await controller.getMovie(1)).toBe(result);
    });
  });

  describe('movies (POST)', () => {
    it('should create a movie', async () => {
      const id = 1;
      jest.spyOn(service, 'createMovie').mockImplementation(() => {
        return 1;
      });
      expect(
        await controller.createMovie({
          title: 'test',
          year: 2020,
          genres: ['test'],
        }),
      ).toEqual(id);
    });
  });
});
