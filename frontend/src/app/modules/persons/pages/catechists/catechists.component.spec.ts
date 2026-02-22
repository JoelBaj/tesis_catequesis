import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatechistsComponent } from './catechists.component';
import { CatechistsService } from '@app/services/modules/persons.service';
import { ToastService } from '@app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

// Mock services
class MockCatechistsService {
  getAll = jasmine.createSpy().and.returnValue(of({ data: [], total: 0 }));
  delete = jasmine.createSpy().and.returnValue(of({}));
}
class MockToastService {
  error = jasmine.createSpy();
  success = jasmine.createSpy();
  info = jasmine.createSpy();
}
class MockRouter {
  navigate = jasmine.createSpy();
  events = of();
}
class MockActivatedRoute {
  children = [];
}

describe('CatechistsComponent', () => {
  let component: CatechistsComponent;
  let fixture: ComponentFixture<CatechistsComponent>;
  let catechistsService: MockCatechistsService;
  let toastService: MockToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatechistsComponent],
      providers: [
        { provide: CatechistsService, useClass: MockCatechistsService },
        { provide: ToastService, useClass: MockToastService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatechistsComponent);
    component = fixture.componentInstance;
    catechistsService = TestBed.inject(CatechistsService) as any;
    toastService = TestBed.inject(ToastService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catechists on init', () => {
    expect(catechistsService.getAll).toHaveBeenCalled();
    expect(component.catechists).toEqual([]);
    expect(component.totalRecords).toBe(0);
  });

  it('should handle error when loading catechists', () => {
    catechistsService.getAll.and.returnValue(throwError(() => new Error('fail')));
    component.loadCatechists();
    expect(toastService.error).toHaveBeenCalledWith('Error al cargar los catequistas');
  });

  it('should call delete and refresh on successful delete', () => {
    spyOn(component, 'loadCatechists');
    component.onDelete({ id: 1 } as any);
    expect(catechistsService.delete).toHaveBeenCalledWith(1);
    expect(toastService.success).toHaveBeenCalledWith('Catequista eliminado correctamente');
    expect(component.loadCatechists).toHaveBeenCalled();
  });

  it('should show error on failed delete', () => {
    catechistsService.delete.and.returnValue(throwError(() => new Error('fail')));
    component.onDelete({ id: 1 } as any);
    expect(toastService.error).toHaveBeenCalledWith('Error al eliminar el catequista');
  });
});
