import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('movies') // 입력된 값이 특별하게 취급되어, 컨트롤러를 위한 url을 만듬, 즉 Entry Point를 컨트롤 함
export class MoviesController {
  @Get()
  getAll() {
    return 'This will return movies';
  }

  @Get('/:id')
  getMovie(@Param('id') id: string) {
    return `Return one movie with the id: ${id}`;
  }

  @Post()
  createMovie() {
    return 'This will create a movie';
  }

  @Delete('/:id')
  deleteMovie(@Param('id') movieId: string) {
    return `Delete Movie with id: ${movieId}`;
  }

  @Patch('/:id')
  pathMovie(@Param('id') movieId: string, @Body() updateData) {
    return {
      updateDataMovie: movieId,
      ...updateData,
    };
  }

  @Get('search')
  search(@Query('year') year: string) {
    return `We are searching for a movie after: ${year}`;
  }
}
