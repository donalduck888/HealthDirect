import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAdminComponentComponent } from './test-admin-component.component';

describe('TestAdminComponentComponent', () => {
  let component: TestAdminComponentComponent;
  let fixture: ComponentFixture<TestAdminComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAdminComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAdminComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
