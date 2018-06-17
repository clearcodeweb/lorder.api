import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from './@common/pipes/validation.pipe';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const SCHEMA = process.env.NODE_ENV === 'production' ? 'https' : 'http';

const corsOptions = {
  origin: ['http://localhost:8181'],
  // methods: '',
  // allowedHeaders: '',
  // exposedHeaders: '',
  // credentials: '',
  // maxAge: '',
  // preflightContinue: '',
  // optionsSuccessStatus: '',
};

async function bootstrap() {
  // TODO: enable only several domains
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Altiore')
    .setDescription('Altiore API documentation')
    .setVersion('1.0')
    .addBearerAuth('Authorization', 'header')
    .setSchemes(SCHEMA)
    .setBasePath('v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => console.log(`Listening on ${SCHEMA}://${HOST}:${PORT}/api/`));
}

bootstrap();
