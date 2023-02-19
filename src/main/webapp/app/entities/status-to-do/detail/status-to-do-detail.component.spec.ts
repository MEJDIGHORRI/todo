import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StatusToDoDetailComponent } from './status-to-do-detail.component';

describe('Component Tests', () => {
  describe('StatusToDo Management Detail Component', () => {
    let comp: StatusToDoDetailComponent;
    let fixture: ComponentFixture<StatusToDoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [StatusToDoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ status: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(StatusToDoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StatusToDoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load status on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.status).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
