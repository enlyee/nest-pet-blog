import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersOutputModelMapper } from '../api/models/output/users.output.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(user: User) {
    const result: UserDocument = await this.userModel.create(user);
    return UsersOutputModelMapper(result);
  }
  async delete(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });
    return !!result.deletedCount;
  }
  async getAllUserDataByLoginOrEmail(loginOrEmail: string) {
    const user: UserDocument | null = await this.userModel
      .findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
      .exec();
    return user;
  }

  async confirmUser(email: string) {
    await this.userModel.updateOne({ email: email }, { isConfirmed: true });
  }
}
