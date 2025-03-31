import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

const mockMovies = [
  { id: 1, title: 'Moana1', genre: 'Animation', duration: 90, rating: '8.0', releaseYear: 2016 },
];

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(entity => entity),
    find: jest.fn().mockResolvedValue(mockMovies),
    findOneBy: jest.fn().mockResolvedValue(mockMovies[0]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    merge: jest.fn().mockImplementation((entity, dto) => ({ ...entity, ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should return all movies', async () => {
    expect(await service.findAll()).toEqual(mockMovies);
  });

  it('should create a movie', async () => {
    expect(await service.create(mockMovies[0])).toEqual(mockMovies[0]);
  });

  it('should find a movie by title', async () => {
    expect(await service.findOneByTitle('Moana1')).toEqual(mockMovies[0]);
  });

  it('should update a movie by title', async () => {
    const updated = { ...mockMovies[0], genre: 'Adventure' };
    mockRepo.findOneBy.mockResolvedValue(mockMovies[0]);
    mockRepo.merge.mockReturnValue(updated);
    mockRepo.save.mockResolvedValue(updated);

    expect(await service.updateByTitle('Moana1', { genre: 'Adventure' })).toEqual(updated);
  });

  it('should delete a movie by title', async () => {
    await expect(service.removeByTitle('Moana1')).resolves.toBeUndefined();
  });
});
