import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashButtonComponent } from './stash-button.component';

describe('StashButtonComponent', () => {
  let component: StashButtonComponent;
  let fixture: ComponentFixture<StashButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
