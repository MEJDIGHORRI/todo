import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserStoryToDoDetailComponent } from './user-story-to-do-detail.component';

describe('Component Tests', () => {
  describe('UserStoryToDo Management Detail Component', () => {
    let comp: UserStoryToDoDetailComponent;
    let fixture: ComponentFixture<UserStoryToDoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UserStoryToDoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ userStory: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UserStoryToDoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserStoryToDoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userStory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userStory).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
