import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies') // 입력된 값이 특별하게 취급되어, 컨트롤러를 위한 url을 만듬, 즉 Entry Point를 컨트롤 함
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get('/:id')
  getMovie(@Param('id') id: number): Movie {
    return this.moviesService.getOne(id); //`Return one movie with the id: ${id}`;
  }

  @Post()
  createMovie(@Body() movieData: CreateMovieDTO) {
    return this.moviesService.createMovie(movieData);
  }

  @Delete('/:id')
  deleteMovie(@Param('id') movieId: number) {
    return this.moviesService.deleteMovie(movieId);
  }

  @Patch('/:id')
  pathMovie(@Param('id') movieId: number, @Body() updateData: UpdateMovieDTO) {
    return this.moviesService.updateMovie(movieId, updateData);
  }
}
