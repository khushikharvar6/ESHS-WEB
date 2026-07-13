import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3001'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ES Healthcare Centre API')
    .setDescription('Complete REST API for ES Healthcare Centre operations')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User Management')
    .addTag('Patients', 'Patient Registration & Management')
    .addTag('Inquiries', 'Inquiry Management')
    .addTag('Appointments', 'Appointment Scheduling')
    .addTag('Doctors', 'Doctor/Consultant Management')
    .addTag('Pricing', 'Tests, Services & Packages')
    .addTag('Billing', 'Invoice & Payment Management')
    .addTag('Feedback', 'Patient Feedback')
    .addTag('SMS', 'SMS & Communication')
    .addTag('MRD', 'Medical Records')
    .addTag('NC', 'Non-Conformance')
    .addTag('Notifications', 'User Notifications')
    .addTag('Dashboard', 'Analytics & Dashboard')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║      ES Healthcare Centre — Backend API          ║
  ║──────────────────────────────────────────────────║
  ║  Server:   http://localhost:${port}                 ║
  ║  API:      http://localhost:${port}/api              ║
  ║  Swagger:  http://localhost:${port}/api/docs         ║
  ╚══════════════════════════════════════════════════╝
  `);
}

bootstrap();
