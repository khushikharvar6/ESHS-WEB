import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PricingModule } from './pricing/pricing.module';
import { BillingModule } from './billing/billing.module';
import { FeedbackModule } from './feedback/feedback.module';

import { MrdModule } from './mrd/mrd.module';
import { NcModule } from './nc/nc.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    InquiryModule,
    AppointmentsModule,
    DoctorsModule,
    PricingModule,
    BillingModule,
    FeedbackModule,

    MrdModule,
    NcModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
