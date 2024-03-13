import { Injectable } from '@nestjs/common';
import { UsersQueryFixedModel } from '../api/models/input/users.query.input.model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/users.entity';
import { Model } from 'mongoose';
import {
  UsersOutputModelMapper,
  UsersOutputModelWithQuery,
  UsersProfileModelMapper,
} from '../api/models/output/users.output.model';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAll(
    query: UsersQueryFixedModel,
  ): Promise<UsersOutputModelWithQuery> {
    const collectionSize = await this.userModel.countDocuments({
      $or: [
        { login: new RegExp(query.searchLoginTerm, 'i') },
        { email: new RegExp(query.searchEmailTerm, 'i') },
      ],
    });
    const findUsers: UserDocument[] = await this.userModel
      .find({
        $or: [
          { login: new RegExp(query.searchLoginTerm, 'i') },
          { email: new RegExp(query.searchEmailTerm, 'i') },
        ],
      })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(+query.pageSize)
      .lean();
    return {
      pagesCount: Math.ceil(collectionSize / query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: collectionSize,
      items: findUsers.map(UsersOutputModelMapper),
    };
  }

  async getProfileById(id: string) {
    const user: UserDocument | null = await this.userModel.findOne({ _id: id });
    if (!user) return null;
    return UsersProfileModelMapper(user);
  }
}
