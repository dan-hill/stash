import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesHeaderComponent } from './attributes-header.component';

describe('AttributesHeaderComponent', () => {
  let component: AttributesHeaderComponent;
  let fixture: ComponentFixture<AttributesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributesHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
