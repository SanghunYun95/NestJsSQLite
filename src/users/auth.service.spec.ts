import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            //find: () => Promise.resolve([]),
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 999999), email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            }    
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
    
        service = module.get(AuthService);
    });
    
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });    

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('aseriuh@sdiuhng.com', 'sdaiufhisd');

        expect(user.password).not.toEqual('sdaiufhisd');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use',async () => {
        //fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'asd', password: 'sdf'} as User]);
        await service.signup('aaavvvsw@aqwdpio9uh.com', 'aaaefdzx');
        await expect(service.signup('aaavvvsw@aqwdpio9uh.com', 'aaaefdzx')).rejects.toThrow(BadRequestException);        
    });

    it('throws if signin is called with an unused email',async () => {
        await expect(service.signin('aseirunzjmn@sidkufhdkj.com', 'zsieuhvjkn')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        /* fakeUsersService.find = () => 
            Promise.resolve([
                {email: 'asd@asd.com', password: 'asds'} as User
            ]);
            await expect(
                service.signin('sordegihj@sdjfin.com', 'passwoxcrd')
            ).rejects.toThrow(BadRequestException); */


        await service.signup('enendjnrgfkj@google.com', 'enendxkr!');
        await expect(service.signin('enendjnrgfkj@google.com', 'asd!')).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided',async () => {
        /* fakeUsersService.find = () => 
            Promise.resolve([
                {email: 'siuhrg@sdoidsf.com', password: '4215168260ae92b0.e30202d140f78269bcf4111e874862f2e7dfd56f60a2a5351d1d50eb09c8f6b0'} as User
            ]); */
        
        await service.signup('siuhrg@sdoidsf.com', 'mypassword');
        const user = await service.signin('siuhrg@sdoidsf.com', 'mypassword');
        expect(user).toBeDefined();

        // const user = await service.signup('siuhrg@sdoidsf.com', 'mypassword');
        // console.log(user);
    })
});
