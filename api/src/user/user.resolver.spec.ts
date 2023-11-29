import { Test } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/dto/jwt-auth.guard';
import { User } from './dto/user.entity';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue([
              {
                _id: '1',
                email: 'test@test.com',
                password: 'password',
              } as User,
            ]),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    resolver = moduleRef.get<UserResolver>(UserResolver);
  });

  it('should return an array of users', async () => {
    const users = await resolver.getAllUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({
      _id: '1',
      email: 'test@test.com',
      password: 'password',
    });
  });
});
