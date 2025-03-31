
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimeService } from './showtime.service';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShowtimeService', () => {
  let service: ShowtimeService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

  const mockShowtimeRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockMovieRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        { provide: getRepositoryToken(Showtime), useValue: mockShowtimeRepo },
        { provide: getRepositoryToken(Movie), useValue: mockMovieRepo },
      ],
    }).compile();

    service = module.get<ShowtimeService>(ShowtimeService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a new showtime', async () => {
    const dto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'A',
      startTime: new Date('2025-03-30T18:00:00Z'),
      endTime: new Date('2025-03-30T20:00:00Z'),
      price: 30,
    };

    const movie = { id: 1 } as Movie;

    movieRepo.findOneBy.mockResolvedValue(movie);

    const qb: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    };

    mockShowtimeRepo.createQueryBuilder.mockReturnValue(qb);
    mockShowtimeRepo.create.mockReturnValue({ ...dto, movie });
    mockShowtimeRepo.save.mockResolvedValue({ id: 1, ...dto, movie });

    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto, movie });
  });

  it('should throw if movie not found during create', async () => {
    movieRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({ movieId: 999, theater: 'A', startTime: new Date(), endTime: new Date(), price: 10 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if overlapping showtime found', async () => {
    const dto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'A',
      startTime: new Date('2025-03-30T18:00:00Z'),
      endTime: new Date('2025-03-30T20:00:00Z'),
      price: 30,
    };
    const movie = { id: 1 } as Movie;
    movieRepo.findOneBy.mockResolvedValue(movie);

    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ id: 99 }),
    };

    mockShowtimeRepo.createQueryBuilder.mockReturnValue(qb);

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should find a showtime by ID', async () => {
    const showtime = { id: 1, movie: { id: 1 } } as Showtime;
    mockShowtimeRepo.findOne.mockResolvedValue(showtime);

    const result = await service.findOne(1);
    expect(result).toEqual(showtime);
  });

  it('should throw if showtime not found', async () => {
    mockShowtimeRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a showtime', async () => {
    const existing = { id: 1, theater: 'A', movie: { id: 1 } } as Showtime;
    const dto: UpdateShowtimeDto = { theater: 'B' };
    mockShowtimeRepo.findOne.mockResolvedValue(existing);
    mockShowtimeRepo.merge.mockReturnValue({ ...existing, ...dto });
    mockShowtimeRepo.save.mockResolvedValue({ ...existing, ...dto });

    const result = await service.update(1, dto);
    expect(result).toEqual({ ...existing, ...dto });
  });

  it('should delete a showtime', async () => {
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null), // no bookings
    };
  
    mockShowtimeRepo.createQueryBuilder.mockReturnValue(qb);
    mockShowtimeRepo.findOne.mockResolvedValue({ id: 1, bookings: [] } as Showtime);
    mockShowtimeRepo.delete.mockResolvedValue({ affected: 1 });
  
    await expect(service.remove(1)).resolves.toBeUndefined();
  });
  
  it('should throw if delete fails', async () => {
    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null), // no bookings
    };
  
    mockShowtimeRepo.createQueryBuilder.mockReturnValue(qb);
    mockShowtimeRepo.findOne.mockResolvedValue({ id: 999, bookings: [] } as Showtime);
    mockShowtimeRepo.delete.mockResolvedValue({ affected: 0 });
  
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
  
});
