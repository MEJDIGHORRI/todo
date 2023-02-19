jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StatusToDoService } from '../service/status-to-do.service';
import { IStatusToDo, StatusToDo } from '../status-to-do.model';
import { IUserStoryToDo } from 'app/entities/user-story-to-do/user-story-to-do.model';
import { UserStoryToDoService } from 'app/entities/user-story-to-do/service/user-story-to-do.service';

import { StatusToDoUpdateComponent } from './status-to-do-update.component';

describe('Component Tests', () => {
  describe('StatusToDo Management Update Component', () => {
    let comp: StatusToDoUpdateComponent;
    let fixture: ComponentFixture<StatusToDoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let statusService: StatusToDoService;
    let userStoryService: UserStoryToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StatusToDoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StatusToDoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusToDoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      statusService = TestBed.inject(StatusToDoService);
      userStoryService = TestBed.inject(UserStoryToDoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call userStory query and add missing value', () => {
        const status: IStatusToDo = { id: 456 };
        const userStory: IUserStoryToDo = { id: 70894 };
        status.userStory = userStory;

        const userStoryCollection: IUserStoryToDo[] = [{ id: 10470 }];
        jest.spyOn(userStoryService, 'query').mockReturnValue(of(new HttpResponse({ body: userStoryCollection })));
        const expectedCollection: IUserStoryToDo[] = [userStory, ...userStoryCollection];
        jest.spyOn(userStoryService, 'addUserStoryToDoToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ status });
        comp.ngOnInit();

        expect(userStoryService.query).toHaveBeenCalled();
        expect(userStoryService.addUserStoryToDoToCollectionIfMissing).toHaveBeenCalledWith(userStoryCollection, userStory);
        expect(comp.userStoriesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const status: IStatusToDo = { id: 456 };
        const userStory: IUserStoryToDo = { id: 18176 };
        status.userStory = userStory;

        activatedRoute.data = of({ status });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(status));
        expect(comp.userStoriesCollection).toContain(userStory);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<StatusToDo>>();
        const status = { id: 123 };
        jest.spyOn(statusService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ status });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: status }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(statusService.update).toHaveBeenCalledWith(status);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<StatusToDo>>();
        const status = new StatusToDo();
        jest.spyOn(statusService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ status });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: status }));
        saveSubject.complete();

        // THEN
        expect(statusService.create).toHaveBeenCalledWith(status);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<StatusToDo>>();
        const status = { id: 123 };
        jest.spyOn(statusService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ status });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(statusService.update).toHaveBeenCalledWith(status);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserStoryToDoById', () => {
        it('Should return tracked UserStoryToDo primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserStoryToDoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
