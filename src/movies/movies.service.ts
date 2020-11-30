import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(movieId: number): Movie {
    const movie = this.movies.find((movie) => movie.id === movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }
    return movie;
  }
  createMovie(movieData: CreateMovieDTO) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  deleteMovie(movieId: number): boolean {
    this.getOne(movieId);
    this.movies = this.movies.filter((movie) => movie.id !== movieId);
    return true;
  }

  updateMovie(movieId: number, updatedMovie) {
    const movie = this.getOne(movieId);
    this.deleteMovie(movieId);
    this.movies.push({ ...movie, ...updatedMovie });
  }
}
