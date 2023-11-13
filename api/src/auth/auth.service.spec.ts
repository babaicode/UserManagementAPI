import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const userServiceMock = {
  findUserByEmail: jest.fn(),
};

const jwtServiceMock = {
  sign: jest.fn(),
};

describe('Auth Service Tests', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateCredentials', () => {
    it('should return a user when valid credentials are provided', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
      };

      userServiceMock.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateCredentials(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
      });
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue(null);

      try {
        await authService.validateCredentials(
          'nonexistent@example.com',
          'password123',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw NotFoundException when invalid credentials are provided', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
      };

      userServiceMock.findUserByEmail.mockResolvedValue(mockUser);

      try {
        await authService.validateCredentials(
          'test@example.com',
          'wrongpassword',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('signIn', () => {
    it('should return a result when valid credentials are provided', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'password123',
      });

      jwtServiceMock.sign.mockReturnValue('mocked-access-token');

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        access_token: 'mocked-access-token',
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
    });

    it('should throw NotFoundException when invalid credentials are provided', async () => {
      userServiceMock.findUserByEmail.mockResolvedValue(null);

      try {
        await authService.signIn({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});