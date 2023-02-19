import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';

import { UserStoryStatusToDoComponent } from './user-story-status-to-do.component';

describe('Component Tests', () => {
  describe('UserStoryStatusToDo Management Component', () => {
    let comp: UserStoryStatusToDoComponent;
    let fixture: ComponentFixture<UserStoryStatusToDoComponent>;
    let service: UserStoryStatusToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStoryStatusToDoComponent],
      })
        .overrideTemplate(UserStoryStatusToDoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStoryStatusToDoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UserStoryStatusToDoService);

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
      expect(comp.userStoryStatuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
