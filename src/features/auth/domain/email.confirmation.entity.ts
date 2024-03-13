import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { add } from 'date-fns/add';

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;

@Schema()
export class EmailConfirmation {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  expiredIn: Date;

  @Prop({ required: true })
  email: string;

  constructor(email: string) {
    this._id = crypto.randomUUID();
    this.expiredIn = add(new Date(), { minutes: 10 });
    this.email = email;
  }
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
