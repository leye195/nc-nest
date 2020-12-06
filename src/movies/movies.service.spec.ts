import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should get an movie', () => {
      service.createMovie({
        title: 'Test',
        genres: ['test'],
        year: 2020,
      });

      const movie = service.getOne(1);

      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
      expect(movie.genres).toBeInstanceOf(Array);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(10);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID 10 not found`);
      }
    });
  });

  describe('createMovie', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;

      service.createMovie({
        title: 'Test',
        genres: ['test'],
        year: 2020,
      });

      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('deleteMovie', () => {
    it('should return true', () => {
      service.createMovie({
        title: 'Test',
        genres: ['test', 'test2'],
        year: 2020,
      });

      const result = service.deleteMovie(1);
      expect(result).toEqual(true);
    });

    it('should delete a movie', () => {
      service.createMovie({
        title: 'Test',
        genres: ['test', 'test2'],
        year: 2020,
      });

      const allMovies = service.getAll().length;
      service.deleteMovie(1);

      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(allMovies);
    });

    it('should throw 404 error', () => {
      try {
        service.deleteMovie(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID 1 not found`);
      }
    });
  });

  describe('updateMovie', () => {
    it('should update movie', () => {
      service.createMovie({
        title: 'Test',
        genres: ['test', 'test2'],
        year: 2020,
      });

      service.updateMovie(1, { title: 'Test Movie' });

      const movie = service.getOne(1);
      expect(movie.title).toEqual('Test Movie');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.updateMovie(1, {
          title: 'TestT',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with ID 1 not found`);
      }
    });
  });
});
