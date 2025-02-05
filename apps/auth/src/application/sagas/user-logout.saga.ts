import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';

import { GoogleLogoutCommand } from '@auth/application/commands/impl/google-logout.command';

import { UserLoggedOutEvent } from '@auth/domain/events/user-logged-out.event';

@Injectable()
export class UserLogoutSaga {
  @Saga()
  userLogout = (events$: Observable<any>): Observable<GoogleLogoutCommand> => {
    return events$.pipe(
      ofType(UserLoggedOutEvent),
      map((event: UserLoggedOutEvent) => {
        return new GoogleLogoutCommand(event.userId);
      }),
    );
  };
}
