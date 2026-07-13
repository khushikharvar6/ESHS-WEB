import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only audit mutations
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next.handle();
    }

    const user = request.user;
    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    const action = `${controller}.${handler}`;

    return next.handle().pipe(
      tap(async (response) => {
        try {
          if (user?.id) {
            // await this.prisma.auditLog.create({...});
          }
        } catch (error) {
          this.logger.warn(`Failed to create audit log: ${error.message}`);
        }
      }),
    );
  }
}
