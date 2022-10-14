import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve( {id, email: 'siu@sdiufhn.com', password: 'asdasd'} as User);
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'asdas'} as User]);
      },
      //remove: () => {},
      //update: () => {}
    };

    fakeAuthService = {
      //signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdsad@sdgioundgf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdsad@sdgioundgf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found',async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrowError(NotFoundException);
  })

  it('singin updates session object and returns user',async () => {
    const session = {userId: -10};
    const user = await controller.singin({email: 'asdiu@sdifuhdfg.com', password: 'asiondf'}, session);

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
