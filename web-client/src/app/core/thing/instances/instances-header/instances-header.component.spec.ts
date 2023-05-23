import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstancesHeaderComponent } from './instances-header.component';

describe('InstancesHeaderComponent', () => {
  let component: InstancesHeaderComponent;
  let fixture: ComponentFixture<InstancesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstancesHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstancesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
