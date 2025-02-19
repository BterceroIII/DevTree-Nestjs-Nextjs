import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/config/logger.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './common/config/typeorm.config';
import { configValidationSchema } from './common/config/validation.config';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsedConfig = configValidationSchema.safeParse(config);
        if (!parsedConfig.success) {
          throw new Error(
            parsedConfig.error.errors.map((error) => error.message).join('\n'),
          );
        }
        return parsedConfig.data;
      },
    }),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware) // Middleware additional
      .forRoutes('*'); // Applies middleware to all routes
  }
}
