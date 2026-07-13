"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3001'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_transform_interceptor_1.ResponseTransformInterceptor());
    const swaggerConfig = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT', 3000);
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
//# sourceMappingURL=main.js.map