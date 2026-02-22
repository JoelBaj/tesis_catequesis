import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/services/base.service';
import { Person, Student, Catechist, Teacher } from '@app/models/persons.model';

@Injectable({
  providedIn: 'root',
})
export class PersonsService extends BaseService<Person> {
  protected override apiUrl = '/persons';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class StudentsService extends BaseService<Student> {
  protected override apiUrl = '/students';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CatechistsService extends BaseService<Catechist> {
  protected override apiUrl = '/catechists';

  constructor(http: HttpClient) {
    super(http);
  }
}

@Injectable({
  providedIn: 'root',
})
export class TeachersService extends BaseService<Teacher> {
  protected override apiUrl = '/teachers';

  constructor(http: HttpClient) {
    super(http);
  }
}
