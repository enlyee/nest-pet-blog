import { Module, Provider } from '@nestjs/common';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query.repository';
import { AuthService } from './features/auth/application/auth.service';
import { LoginIsExistConstraint } from './common/decorators/validate/login.registration.decorator';
import { EmailIsExistConstraint } from './common/decorators/validate/email.registration.decorator';
import { EmailConfirmationConstraint } from './common/decorators/validate/email.confirmation.decorator';
import { EmailConfirmationResendingConstraint } from './common/decorators/validate/email.confirmation.resending.decorator';
import { EmailConfirmationRepository } from './features/auth/infrastructure/email.confirmation.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query.repository';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './common/strategies/jwt.strategy';
import { BasicStrategy } from './common/strategies/basic.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/users.entity';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import { Post, PostSchema } from './features/posts/domain/posts.entity';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comments.entity';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './features/auth/domain/email.confirmation.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './features/auth/constants';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersController } from './features/users/api/users.controller';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { PostsController } from './features/posts/api/posts.controller';
import { CommentsController } from './features/comments/api/comments.controller';
import { TestingGodController } from './features/testing/testing.god.controller';
import { AuthController } from './features/auth/api/auth.controller';
import { MailService } from './features/mailer/api/mailer';

const usersProviders: Provider[] = [
  UsersService,
  UsersRepository,
  UsersQueryRepository,
];

const blogsProviders: Provider[] = [
  BlogsService,
  BlogsRepository,
  BlogsQueryRepository,
];

const postsProviders: Provider[] = [
  PostsService,
  PostsRepository,
  PostsQueryRepository,
];

const authProviders: Provider[] = [
  AuthService,
  LoginIsExistConstraint,
  EmailIsExistConstraint,
  EmailConfirmationConstraint,
  EmailConfirmationResendingConstraint,
  EmailConfirmationRepository,
];

const commentsProviders: Provider[] = [CommentsQueryRepository];

const strategies: Provider[] = [
  AccessTokenStrategy,
  RefreshTokenStrategy,
  BasicStrategy,
];

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://enlyee:incpass@cluster0.rzs8jwh.mongodb.net/nest2?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: EmailConfirmation.name, schema: EmailConfirmationSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
          user: 'backendtest228@gmail.com',
          pass: 'awjm cghm cqss emeo',
        },
      },
      defaults: {
        from: '"BloggerPlatform" <backendtest228@gmail.com>',
      },
      template: {
        dir: process.cwd() + '/src/features/mailer/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingGodController,
    AuthController,
  ],
  providers: [
    ...authProviders,
    ...strategies,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    MailService,
  ],
})
export class AppModule {}
