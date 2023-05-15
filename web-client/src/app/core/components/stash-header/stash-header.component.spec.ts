import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StashHeaderComponent } from './stash-header.component';

describe('StashHeaderComponent', () => {
  let component: StashHeaderComponent;
  let fixture: ComponentFixture<StashHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StashHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StashHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
