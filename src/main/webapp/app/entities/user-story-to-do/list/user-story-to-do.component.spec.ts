import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserStoryToDoService } from '../service/user-story-to-do.service';

import { UserStoryToDoComponent } from './user-story-to-do.component';

describe('Component Tests', () => {
  describe('UserStoryToDo Management Component', () => {
    let comp: UserStoryToDoComponent;
    let fixture: ComponentFixture<UserStoryToDoComponent>;
    let service: UserStoryToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStoryToDoComponent],
      })
        .overrideTemplate(UserStoryToDoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStoryToDoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UserStoryToDoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.userStories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
