// booking.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  const mockService = {
    create: jest.fn().mockResolvedValue({ bookingId: 'abc-123' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create and return bookingId', async () => {
    const dto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 15,
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    };

    const result = await controller.book(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ bookingId: 'abc-123' });
  });
});
