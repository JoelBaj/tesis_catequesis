import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@modules/auth/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@modules/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('@modules/dashboard/pages/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'countries',
        loadComponent: () =>
          import('@modules/configuration/pages/countries/countries.component').then(
            (m) => m.CountriesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/configuration/pages/countries/country-form/country-form.component').then(
                (m) => m.CountryFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/configuration/pages/countries/country-form/country-form.component').then(
                (m) => m.CountryFormComponent,
              ),
          },
        ],
      },
      {
        path: 'provinces',
        loadComponent: () =>
          import('@modules/configuration/pages/provinces/provinces.component').then(
            (m) => m.ProvincesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/configuration/pages/provinces/province-form/province-form.component').then(
                (m) => m.ProvinceFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/configuration/pages/provinces/province-form/province-form.component').then(
                (m) => m.ProvinceFormComponent,
              ),
          },
        ],
      },
      {
        path: 'cities',
        loadComponent: () =>
          import('@modules/configuration/pages/cities/cities.component').then(
            (m) => m.CitiesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/configuration/pages/cities/city-form/city-form.component').then(
                (m) => m.CityFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/configuration/pages/cities/city-form/city-form.component').then(
                (m) => m.CityFormComponent,
              ),
          },
        ],
      },
      {
        path: 'parameter-types',
        loadComponent: () =>
          import('@modules/configuration/pages/parameter-types/parameter-types.component').then(
            (m) => m.ParameterTypesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/configuration/pages/parameter-types/parameter-types-form.component').then(
                (m) => m.ParameterTypesFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/configuration/pages/parameter-types/parameter-types-form.component').then(
                (m) => m.ParameterTypesFormComponent,
              ),
          },
        ],
      },
      {
        path: 'persons',
        loadComponent: () =>
          import('@modules/persons/pages/persons/persons.component').then(
            (m) => m.PersonsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/persons/pages/persons/persons-form.component').then(
                (m) => m.PersonsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/persons/pages/persons/persons-form.component').then(
                (m) => m.PersonsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'students',
        loadComponent: () =>
          import('@modules/persons/pages/students/students.component').then(
            (m) => m.StudentsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/persons/pages/students/students-form.component').then(
                (m) => m.StudentsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/persons/pages/students/students-form.component').then(
                (m) => m.StudentsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'catechists',
        loadComponent: () =>
          import('@modules/persons/pages/catechists/catechists.component').then(
            (m) => m.CatechistsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/persons/pages/catechists/catechists-form.component').then(
                (m) => m.CatechistsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/persons/pages/catechists/catechists-form.component').then(
                (m) => m.CatechistsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('@modules/academic/pages/courses/courses.component').then(
            (m) => m.CoursesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/academic/pages/courses/courses-form.component').then(
                (m) => m.CoursesFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/academic/pages/courses/courses-form.component').then(
                (m) => m.CoursesFormComponent,
              ),
          },
        ],
      },
      // {
      //   path: 'subjects',
      //   loadComponent: () =>
      //     import('@modules/academic/pages/subjects/subjects.component').then(
      //       (m) => m.SubjectsComponent,
      //     ),
      // },
      {
        path: 'levels',
        loadComponent: () =>
          import('@modules/academic/pages/levels/levels.component').then(
            (m) => m.LevelsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/academic/pages/levels/levels-form.component').then(
                (m) => m.LevelsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/academic/pages/levels/levels-form.component').then(
                (m) => m.LevelsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'planning',
        loadComponent: () =>
          import('@modules/academic/pages/planning/planning.component').then(
            (m) => m.PlanningComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/academic/pages/planning/planning-form.component').then(
                (m) => m.PlanningFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/academic/pages/planning/planning-form.component').then(
                (m) => m.PlanningFormComponent,
              ),
          },
        ],
      },
      {
        path: 'grades',
        loadComponent: () =>
          import('@modules/academic/pages/grades/grades.component').then(
            (m) => m.GradesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/academic/pages/grades/grades-form.component').then(
                (m) => m.GradesFormComponent,
              ),
          },
          {
            path: 'edit-single/:id',
            loadComponent: () =>
              import('@modules/academic/pages/grades/grades-edit.component').then(
                (m) => m.GradesEditComponent,
              ),
          },
        ],
      },
      {
        path: 'encounters',
        loadComponent: () =>
          import('@modules/attendance/pages/encounters/encounters.component').then(
            (m) => m.EncountersComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/attendance/pages/encounters/encounters-form.component').then(
                (m) => m.EncountersFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/attendance/pages/encounters/encounters-form.component').then(
                (m) => m.EncountersFormComponent,
              ),
          },
        ],
      },
      {
        path: 'attendance',
        redirectTo: 'attendances',
        pathMatch: 'full',
      },
      {
        path: 'attendances',
        loadComponent: () =>
          import('@modules/attendance/pages/attendances/attendances.component').then(
            (m) => m.AttendancesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/attendance/pages/attendances/attendances-form.component').then(
                (m) => m.AttendancesFormComponent,
              ),
          },
          {
            path: 'edit-single/:id',
            loadComponent: () =>
              import('@modules/attendance/pages/attendances/attendances-edit.component').then(
                (m) => m.AttendancesEditComponent,
              ),
          },
        ],
      },
      {
        path: 'events',
        loadComponent: () =>
          import('@modules/events/pages/events/events.component').then(
            (m) => m.EventsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/events/pages/events/events-form.component').then(
                (m) => m.EventsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/events/pages/events/events-form.component').then(
                (m) => m.EventsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'event-attendances',
        loadComponent: () =>
          import('@modules/events/pages/event-attendances/event-attendances.component').then(
            (m) => m.EventAttendancesComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/events/pages/event-attendances/event-attendances-form.component').then(
                (m) => m.EventAttendancesFormComponent,
              ),
          },
          {
            path: 'edit-single/:id',
            loadComponent: () =>
              import('@modules/events/pages/event-attendances/event-attendances-edit.component').then(
                (m) => m.EventAttendancesEditComponent,
              ),
          },
        ],
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('@modules/enrollment/pages/enrollments/enrollments.component').then(
            (m) => m.EnrollmentsComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/enrollment/pages/enrollments/enrollments-form.component').then(
                (m) => m.EnrollmentsFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/enrollment/pages/enrollments/enrollments-form.component').then(
                (m) => m.EnrollmentsFormComponent,
              ),
          },
        ],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@modules/users/pages/users/users.component').then(
            (m) => m.UsersComponent,
          ),
        children: [
          {
            path: 'add',
            loadComponent: () =>
              import('@modules/users/pages/users/users-form.component').then(
                (m) => m.UsersFormComponent,
              ),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('@modules/users/pages/users/users-form.component').then(
                (m) => m.UsersFormComponent,
              ),
          },
        ],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('@modules/notifications/pages/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
