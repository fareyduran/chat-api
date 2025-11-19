import { Test, TestingModule } from '@nestjs/testing';
import { CreateMessageHandler } from './create-message.handler';
import { CreateMessageCommand } from '@messages/application/commands/create-message.command';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { MessageGateway } from '@messages/infrastructure/adapters/inbound/gateways/message.gateway';
import { Message } from '@messages/domain/entities/message.entity';
import { MessageResponseDto } from '@messages/infrastructure/adapters/inbound/dto/message-response.dto';
import type { RoomRepository } from '@rooms/domain/ports/room-repository.port';
import type { UserRepository } from '@users/domain/ports/user-respository.port';
import type { MessageRepository } from '@messages/domain/ports/message-repository.port';

describe('CreateMessageHandler', () => {
  let handler: CreateMessageHandler;
  let roomRepository: jest.Mocked<RoomRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let messageRepository: jest.Mocked<MessageRepository>;
  let messageGateway: jest.Mocked<MessageGateway>;

  const mockUser = {
    getId: jest.fn().mockReturnValue('user-123'),
    getName: jest.fn().mockReturnValue('John Doe'),
    getEmail: jest.fn().mockReturnValue('john@example.com'),
  };

  const mockRoom = {
    getId: jest.fn().mockReturnValue('room-123'),
    getName: jest.fn().mockReturnValue('Test Room'),
  };

  const mockMessage = {
    getId: jest.fn().mockReturnValue('message-123'),
    getRoomId: jest.fn().mockReturnValue('room-123'),
    getSenderId: jest.fn().mockReturnValue('user-123'),
    getSenderName: jest.fn().mockReturnValue('John Doe'),
    getMessage: jest.fn().mockReturnValue('Hello World'),
    getSentAt: jest.fn().mockReturnValue(new Date('2025-01-01')),
    toJson: jest.fn().mockReturnValue({
      id: 'message-123',
      roomId: 'room-123',
      senderId: 'user-123',
      senderName: 'John Doe',
      message: 'Hello World',
      sentAt: new Date('2025-01-01'),
    }),
  };

  beforeEach(async () => {
    const mockRoomRepository = {
      findById: jest.fn(),
      findParticipantInRoom: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      assignParticipant: jest.fn(),
      removeParticipant: jest.fn(),
    };

    const mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const mockMessageRepository = {
      save: jest.fn(),
      findByRoomId: jest.fn(),
    };

    const mockMessageGateway = {
      notifyNewMessage: jest.fn(),
      handleConnection: jest.fn(),
      handleDisconnect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMessageHandler,
        {
          provide: 'RoomRepository',
          useValue: mockRoomRepository,
        },
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'MessageRepository',
          useValue: mockMessageRepository,
        },
        {
          provide: MessageGateway,
          useValue: mockMessageGateway,
        },
      ],
    }).compile();

    handler = module.get<CreateMessageHandler>(CreateMessageHandler);
    roomRepository = module.get('RoomRepository');
    userRepository = module.get('UserRepository');
    messageRepository = module.get('MessageRepository');
    messageGateway = module.get(MessageGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a message successfully', async () => {

      const command = new CreateMessageCommand('room-123', 'user-123', 'Hello World');

      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(mockRoom as any);
      roomRepository.findParticipantInRoom.mockResolvedValue(true);
      messageRepository.save.mockResolvedValue(mockMessage as any);


      const result = await handler.execute(command);


      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(roomRepository.findById).toHaveBeenCalledWith('room-123');
      expect(roomRepository.findParticipantInRoom).toHaveBeenCalledWith('room-123', 'user-123');
      expect(messageRepository.save).toHaveBeenCalled();
      expect(messageGateway.notifyNewMessage).toHaveBeenCalledWith(
        'room-123',
        expect.any(MessageResponseDto),
      );
      expect(result).toEqual(mockMessage);
    });

    it('should throw BadRequestException when user is not found', async () => {

      const command = new CreateMessageCommand('room-123', 'user-999', 'Hello World');
      userRepository.findById.mockResolvedValue(null);


      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('User user-999 not found.'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user-999');
      expect(roomRepository.findById).not.toHaveBeenCalled();
      expect(messageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when room is not found', async () => {

      const command = new CreateMessageCommand('room-999', 'user-123', 'Hello World');
      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(null);


      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Room room-999 not found.'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(roomRepository.findById).toHaveBeenCalledWith('room-999');
      expect(roomRepository.findParticipantInRoom).not.toHaveBeenCalled();
      expect(messageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not a participant of the room', async () => {

      const command = new CreateMessageCommand('room-123', 'user-123', 'Hello World');
      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(mockRoom as any);
      roomRepository.findParticipantInRoom.mockResolvedValue(false);


      await expect(handler.execute(command)).rejects.toThrow(
        new UnauthorizedException('User user-123 is not a participant of room room-123.'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(roomRepository.findById).toHaveBeenCalledWith('room-123');
      expect(roomRepository.findParticipantInRoom).toHaveBeenCalledWith('room-123', 'user-123');
      expect(messageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when message repository fails to save', async () => {

      const command = new CreateMessageCommand('room-123', 'user-123', 'Hello World');
      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(mockRoom as any);
      roomRepository.findParticipantInRoom.mockResolvedValue(true);
      messageRepository.save.mockRejectedValue(new Error('Database error'));


      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Could not create message...'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user-123');
      expect(roomRepository.findById).toHaveBeenCalledWith('room-123');
      expect(roomRepository.findParticipantInRoom).toHaveBeenCalledWith('room-123', 'user-123');
      expect(messageRepository.save).toHaveBeenCalled();
      expect(messageGateway.notifyNewMessage).not.toHaveBeenCalled();
    });

    it('should call messageGateway.notifyNewMessage with correct parameters', async () => {

      const command = new CreateMessageCommand('room-123', 'user-123', 'Hello World');
      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(mockRoom as any);
      roomRepository.findParticipantInRoom.mockResolvedValue(true);
      messageRepository.save.mockResolvedValue(mockMessage as any);


      await handler.execute(command);


      expect(messageGateway.notifyNewMessage).toHaveBeenCalledTimes(1);
      expect(messageGateway.notifyNewMessage).toHaveBeenCalledWith(
        'room-123',
        expect.objectContaining({
          id: 'message-123',
          roomId: 'room-123',
          senderId: 'user-123',
          senderName: 'John Doe',
          message: 'Hello World',
        }),
      );
    });

    it('should create message with correct data from Message.create', async () => {

      const command = new CreateMessageCommand('room-123', 'user-123', 'Test message');
      userRepository.findById.mockResolvedValue(mockUser as any);
      roomRepository.findById.mockResolvedValue(mockRoom as any);
      roomRepository.findParticipantInRoom.mockResolvedValue(true);

      const saveSpy = jest.fn().mockResolvedValue(mockMessage as any);
      messageRepository.save = saveSpy;


      await handler.execute(command);


      expect(saveSpy).toHaveBeenCalledWith(expect.any(Message));
      const savedMessage = saveSpy.mock.calls[0][0] as Message;
      expect(savedMessage.getRoomId()).toBe('room-123');
      expect(savedMessage.getSenderId()).toBe('user-123');
      expect(savedMessage.getSenderName()).toBe('John Doe');
      expect(savedMessage.getMessage()).toBe('Test message');
    });
  });
});
