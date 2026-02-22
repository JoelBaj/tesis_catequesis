import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/services/base.service';
import { User } from '@app/models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService<User> {
  protected override apiUrl = '/users';

  constructor(http: HttpClient) {
    super(http);
  }
}
