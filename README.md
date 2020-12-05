# Learn Nest

Learn how to build NodeJS applications using NestJS

NestJS는 프레임워크이며 미리 세팅돈 여러 기능들을 제공한다.<br/>

@nestjs/cli 설치 필요 <br/>

```
npm i -g @nestjs/cli
nest new project-name
```

NestJS는 `main.ts` 파일을 가짐 <br/>

```
//main.ts, nestJS는 main.ts에서 시작하며 하나의 모듈에서 어플리케이션을 생성한다.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

//app.module.ts, 모든 것의 루트 모듈 같은 것,
//모듈은 어플리케이션의 일부분 이라고 할 수 있다.
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({ //데코레이터 함수, nestjs는 데코레이터와 함께하기 때문에 익숙해질 필요가 있음
  imports: [],
  controllers: [AppController], //기본적으로 url을 가져오고 함수를 실행함
  providers: [AppService], //
})
export class AppModule {}
// 데코레이터는 클래스에 함수 기능을 추가 할 수 있다.
// 그냥 클래스 위의 함수이며, 클래스를 위해 움직임

//app.controllers.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //express의 get 라우터와 같은 역활
  getHello(): string {
    return this.appService.getHello()
  }// 여기서는 Service를 참조

  @Get('/hello') // /hello를 getSayHi 함수로 맵핑 시켜줌
  getSayHi(): string {
    return 'hi';
  }
  //데코레이터는 항상 꾸며주는 함수나 클래스랑 붙어있어야 된다
}
```

## Service와 Controller

- NestJS는 Controller를 비즈니스 로직이랑 구분 짓고 싶어한다.
- Controller 는 그냥 url을 가져오는 함수 실행결과를 리턴 하는 역할을
- Service를 통해 비즈니스 로직을 구현한다.

## Rest API 만들기

```
nest g co  // controller 생성해줌
or
nest generate co
```

```
import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

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
  pathMovie(@Param('id') movieId: string) {
    return `This will patch a movie ${movieId}`;
  }
}
//nest의 경우 무건가 필요하면 요청을 해줘야된다,
//url에 있는 id값을 알고 싶은 경우, @Param('id') id: string 을 작성
//@Body
```

**Movies Service**

Single-responsibility principle<br/>

하나의 module, class 혹은 function이 하나만의 기능을 책임 져야된다.<br/>

**Services: 로직을 관리하는 역할**

```
nest g service (s)

or

nest generate service (s)

/* service의 이름을 입력
ex) movies, 아래와 같은 두 파일이 생성 됨
movies.service.spec (테스트 파일)
movies.service.ts

app.module.ts의 providers에 자동으로 MovieService가 추가됨
*/

import { Injectable } from '@nestjs/common';
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
			new throw NotFoundException("");
		}
		return movie;
  }

	create(movieData) {
		this.movies.push({
			id: this.movies.length + 1,
			...movieData,
		})
	}

	delete(movieId: string): boolean {
		this.movies.filter((movie)=>movie.id !== +movidId);
		return true;
	}

	update(movieId: string, updatedMovie) {
		const movie = this.getOne(movieId);
		this.delete(movieId);
		this.movies.push({...movie,...updateMovie});
	}
}
```

**Controller에서 Service에 접근하는 방법**

- express와 달리 nest에서는 요청을 해야된다

```
@Controller('movies');
export class MoviesController {
	constructor(private readonly moviesService: MoviesService){}

	@Get()
	getAll: Movie[] {
		return this.moviesService.getAll();
	}

	@Get('/:id')
	getOne(@Param('id') id: string): Movie {
		return this.moviesService.getOne(id);
	}

	@Post()
	create(@Body() movieData) {
		return this.moviesService.create(movieData);
	}

	@Delete()
	delete(@Param('id') id: string) :boolean {
		return this.moviesService.delete(id);
	}
}
```

**DTO: Data Transfer Object (데이터 전송 객체)**

```
//create-movie.dto.ts

import {IsString, IsNumber} from 'class-validator';
//class-validator
//class-transform

export class CreateMovieDTO {
	@IsString()
	readonly title: string;

	@IsNumber()
	readonly year: number;

	@IsString()
	readonly genres: string[];
}

export class UpdateMovieDTO extends PartialType(baseType){}
//PartialType() - @nextjs/mapped-types

```

nestJS는 타입을 받아서 넘겨줄 때 자동으로 타입을 변환해 주도록 설정해 줄 수 있음.

```
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation pipe (middle 비슷하게 생각해도 됨)
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true, // 유저가 보낸 것을 원하는 실제 타입으로 전환
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

**app.module.ts, modules and dependency injection**

- app.module은 원래 AppController와 AppProvider만 가지고 있어야 된다.
- NestJS에서 앱은 여러개의 모듈로 구성되기 때문에 분리된 모듈들을 app.module을 통해 import 해주자

```
nest g(generate) mo (module)

//app.module의 imports에 생성된 module이 추가됨
//생성한 movies.module.ts에 controllers와 providers를 추가해줌

//app.module.ts
@Module({
	imports: [MoviesModule]
	controllers: [],
	providers: [],
})
export class AppModule {}

//movies.module.ts
@Module({
	controllers: [MoviesController],
	providers: [MovieService],
})
export class MovieModule {}
```

**dependency injection**

- providers에 Service를 제공하면 nestJS는 providers에 제공된 Service를 import 하고 Controller에 inject해준다.
- Service에 @Injectable이라는 decorator가 있는데 nestJS가 알아서 import 해주는데 필요함

**nestJS에서 req,res 접근**

- 기본적으로 nestJS는 Express 위에서 돌아가고 있기에 Controller에 Request, Response 객체가 필요하다면 사용할 수 있음
- req, res 같은 express 객체를 직접적으로 사용하는 방법은 좋은 방법이 아님
- 이유: 2개의 framework 위에서 동시에 작동하고 있기 때문 (Fastify, Express)

```
// ex)
@Get()
getAll(@Req() req, @Res() res): Movie[] {}
```
