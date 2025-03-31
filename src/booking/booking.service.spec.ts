// Test suite for BookingService    
import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: jest.Mocked<Repository<Booking>>;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;

  const mockBookingRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockShowtimeRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: getRepositoryToken(Showtime), useValue: mockShowtimeRepo },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    showtimeRepo = module.get(getRepositoryToken(Showtime));
  });

  afterEach(() => jest.clearAllMocks());

  it('should successfully create a booking', async () => {
    const dto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: 'user-123',
    };
    const showtime = { id: 1 } as Showtime;

    showtimeRepo.findOneBy.mockResolvedValue(showtime);
    bookingRepo.findOneBy.mockResolvedValue(null);
    bookingRepo.create.mockReturnValue({ ...dto, showtime } as Booking);
    bookingRepo.save.mockResolvedValue({ id: 'booking-456' } as Booking);

    const result = await service.create(dto);
    expect(result).toEqual({ bookingId: 'booking-456' });
  });

  it('should throw NotFoundException if showtime not found', async () => {
    showtimeRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({ showtimeId: 1, seatNumber: 1, userId: 'user' })
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if seat already booked', async () => {
    const dto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: 'user-123',
    };

    showtimeRepo.findOneBy.mockResolvedValue({ id: 1 } as Showtime);
    bookingRepo.findOneBy.mockResolvedValue({ id: 'existing' } as Booking);

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});
