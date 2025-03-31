import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMovie = {
    id: 1,
    title: 'Moana1',
    genre: 'Animation',
    duration: 90,
    rating: '8.0',
    releaseYear: 2016,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockMovie),
    findAll: jest.fn().mockResolvedValue([mockMovie]),
    findOneByTitle: jest.fn().mockResolvedValue(mockMovie),
    updateByTitle: jest.fn().mockResolvedValue({ ...mockMovie, genre: 'Adventure' }),
    removeByTitle: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should return all movies', async () => {
    expect(await controller.findAll()).toEqual([mockMovie]);
  });

  it('should create a movie', async () => {
    expect(await controller.create(mockMovie as CreateMovieDto)).toEqual(mockMovie);
  });

  it('should find a movie by title', async () => {
    expect(await controller.findOne('Moana1')).toEqual(mockMovie);
  });

  it('should update a movie by title', async () => {
    const updated = await controller.update('Moana1', { genre: 'Adventure' } as UpdateMovieDto);
    expect(updated.genre).toBe('Adventure');
  });

  it('should delete a movie by title', async () => {
    await expect(controller.remove('Moana1')).resolves.toBeUndefined();
  });
});
