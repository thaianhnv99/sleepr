import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const jwt =
      request?.cookies?.Authentication || request.headers?.authentication;
    if (!jwt) {
      return false;
    }

    return this.authClient
      .send('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          request.user = res;
        }),
        catchError((err) => {
          this.logger.error('12345', err);
          return of(false);
        }),
      );
  }
}
