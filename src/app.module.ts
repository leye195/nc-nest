import { Module } from '@nestjs/common';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [],
})
export class AppModule {}

//AppModules은 NestJS가 애플리케이션을 만들기 위해 이용하는 것이기 때문
