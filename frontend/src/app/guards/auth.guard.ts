import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  return auth.me().pipe(
    map((user) => {
      if (user) return true;
      auth.goToCentralLogin(state.url);
      return false;
    })
  );
};