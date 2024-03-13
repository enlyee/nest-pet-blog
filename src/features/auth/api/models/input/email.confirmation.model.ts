import { EmailConfirmation } from '../../../../../common/decorators/validate/email.confirmation.decorator';
import { IsEmail } from 'class-validator';
import { EmailConfirmationResending } from '../../../../../common/decorators/validate/email.confirmation.resending.decorator';

export class CodeConfirmationModel {
  @EmailConfirmation()
  code: string;
}

export class EmailResending {
  @IsEmail()
  @EmailConfirmationResending()
  email: string;
}
