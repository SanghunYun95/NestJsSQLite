import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>)     {}

    create(email: string, password: string) {
        const user = this.repo.create({email, password});

        return this.repo.save(user);
    }

    findOne(id: number) {
        // return this.repo.findOne(id);

        // as of typeorm v0.3.0
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        // return this.repo.find({ email });

        // as of typeorm v0.3.0
        return this.repo.find({ where: { email }});
    }

    update() {}

    remove() {}
}