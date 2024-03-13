import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailConfirmation,
  EmailConfirmationDocument,
} from '../domain/email.confirmation.entity';
import { Model } from 'mongoose';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectModel(EmailConfirmation.name)
    private emailConfirmationModel: Model<EmailConfirmation>,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createConfirmation(confirmation: EmailConfirmation) {
    await this.emailConfirmationModel.create(confirmation);
  }

  async findConfirmation(code: string) {
    const confirm: EmailConfirmationDocument | null =
      await this.emailConfirmationModel.findOne({ _id: code });
    return confirm;
  }

  async getAndDeleteConfirmation(code: string) {
    return this.emailConfirmationModel.findOneAndDelete({ _id: code });
  }

  async recreateConfirmationByEmail(confirmation: EmailConfirmation) {
    const isExist = !!(
      await this.emailConfirmationModel.deleteOne({ email: confirmation.email })
    ).deletedCount;
    if (!isExist) return null;
    await this.emailConfirmationModel.create(confirmation);
    return true;
  }
}
