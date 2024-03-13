import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UserDocument } from '../../users/domain/users.entity';
import { jwtConstants } from '../constants';
import { LoginAuthModel } from '../api/models/input/login.auth.model';
import { RegistrationAuthModel } from '../api/models/input/registration.auth.model';
import { UsersService } from '../../users/application/users.service';
import { MailService } from '../../mailer/api/mailer';
import * as bcrypt from 'bcryptjs';
import {
  EmailConfirmation,
  EmailConfirmationDocument,
} from '../domain/email.confirmation.entity';
import { EmailConfirmationRepository } from '../infrastructure/email.confirmation.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}
  async register(userData: RegistrationAuthModel) {
    const confirmation = new EmailConfirmation(userData.email);
    await this.emailConfirmationRepository.createConfirmation(confirmation);
    await this.mailService.sendUserConfirmation(
      userData.email,
      confirmation._id,
    );
    await this.usersService.createUser(userData);
  }
  async login(loginData: LoginAuthModel) {
    const user: UserDocument | null =
      await this.usersRepository.getAllUserDataByLoginOrEmail(
        loginData.loginOrEmail,
      );
    if (!user) return null;
    const hashCompare = await this._compareHashes(
      loginData.password,
      user.passwordHash,
    );
    const deviceId: string = crypto.randomUUID();
    if (!hashCompare) return null;
    const tokens = await this._getTokens(user._id, deviceId);
    return tokens;
  }
  async resendEmail(email: string) {
    const confirmation = new EmailConfirmation(email);
    const status =
      await this.emailConfirmationRepository.recreateConfirmationByEmail(
        confirmation,
      );
    if (!status) return null;
    await this.mailService.sendUserConfirmation(email, confirmation._id);
  }
  async confirmUser(code: string) {
    const conf: EmailConfirmationDocument | null =
      await this.emailConfirmationRepository.getAndDeleteConfirmation(code);
    if (!conf) return null;
    await this.usersRepository.confirmUser(conf.email);
  }
  private async _compareHashes(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
  private async _getTokens(userId: string, deviceId: string) {
    const accessToken = this.jwtService.sign(
      { userId: userId },
      { secret: jwtConstants.secret, expiresIn: '10m' },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      { secret: jwtConstants.secret, expiresIn: '1h' },
    );
    return { refreshToken: refreshToken, accessToken: accessToken };
  }
}
