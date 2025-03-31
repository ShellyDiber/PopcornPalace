// showtime.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimeController', () => {
  let controller: ShowtimeController;
  let service: ShowtimeService;

  const mockShowtime = {
    id: 1,
    movieId: 1,
    theater: 'A',
    startTime: new Date('2025-03-30T18:00:00Z'),
    endTime: new Date('2025-03-30T20:00:00Z'),
    price: 30,
    movie: { id: 1, title: 'Moana' },
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockShowtime),
    findOne: jest.fn().mockResolvedValue(mockShowtime),
    update: jest.fn().mockResolvedValue({ ...mockShowtime, theater: 'B' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeController],
      providers: [
        {
          provide: ShowtimeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimeController>(ShowtimeController);
    service = module.get<ShowtimeService>(ShowtimeService);
  });

  it('should create a showtime', async () => {
    const dto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'A',
      startTime: new Date(),
      endTime: new Date(),
      price: 20,
    };
    expect(await controller.create(dto)).toEqual(mockShowtime);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should get a showtime by id', async () => {
    expect(await controller.findOne(1)).toEqual(mockShowtime);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a showtime', async () => {
    const dto: UpdateShowtimeDto = { theater: 'B' };
    const result = await controller.update(1, dto);
    expect(result.theater).toBe('B');
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a showtime', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
