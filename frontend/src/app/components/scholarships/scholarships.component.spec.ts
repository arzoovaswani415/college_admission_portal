import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsComponent } from './scholarships.component';

describe('ScholarshipsComponent', () => {
  let component: ScholarshipsComponent;
  let fixture: ComponentFixture<ScholarshipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScholarshipsComponent]
    });
    fixture = TestBed.createComponent(ScholarshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
