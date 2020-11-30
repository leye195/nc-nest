import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(movieId: string): Movie {
    const movie = this.movies.find((movie) => movie.id === +movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
    return movie;
  }
  createMovie(movieData) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  deleteMovie(movieId: string): boolean {
    this.getOne(movieId);
    this.movies = this.movies.filter((movie) => movie.id !== +movieId);
    return true;
  }

  updateMovie(movieId: string, updatedMovie) {
    const movie = this.getOne(movieId);
    this.deleteMovie(movieId);
    this.movies.push({ ...movie, ...updatedMovie });
  }
}
