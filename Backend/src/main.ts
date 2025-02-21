import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import YAML from 'yamljs';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // integrate Helmet for security
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  //Swagger Settings
  const config = new DocumentBuilder()
    .setTitle('DevTree')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      // Delete the "Controller" suffix from the controller name
      return `${controllerKey.replace('Controller', '')}_${methodKey}`;
    },
  });
  SwaggerModule.setup('docs', app, document);

  app.getHttpAdapter().get('/swagger.yaml', (req, res) => {
    const swaggerYaml = YAML.stringify(document);
    res.setHeader('Content-Type', 'application/x-yaml');
    res.send(swaggerYaml);
  });

  const port = process.env.PORT || 3000;

  //use logger with nest-winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(port);

  Logger.log(
    `Starting database query with prefix: '${process.env.DB_PREFIX ?? ''}'`,
    'Bootstrap',
  );
  Logger.log(
    `Swagger UI is accessible at: http://localhost:${port}/docs`,
    'Bootstrap',
  );
  Logger.log(
    `Swagger YAML documentation available at: http://localhost:${port}/swagger.yaml`,
    'Bootstrap',
  );
}
bootstrap();
