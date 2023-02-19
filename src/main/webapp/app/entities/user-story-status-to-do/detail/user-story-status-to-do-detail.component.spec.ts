import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserStoryStatusToDoDetailComponent } from './user-story-status-to-do-detail.component';

describe('Component Tests', () => {
  describe('UserStoryStatusToDo Management Detail Component', () => {
    let comp: UserStoryStatusToDoDetailComponent;
    let fixture: ComponentFixture<UserStoryStatusToDoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserStoryStatusToDoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userStoryStatus: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserStoryStatusToDoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserStoryStatusToDoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userStoryStatus on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userStoryStatus).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
