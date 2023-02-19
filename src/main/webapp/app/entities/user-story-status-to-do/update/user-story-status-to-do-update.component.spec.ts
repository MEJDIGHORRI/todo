jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserStoryStatusToDoService } from '../service/user-story-status-to-do.service';
import { IUserStoryStatusToDo, UserStoryStatusToDo } from '../user-story-status-to-do.model';

import { UserStoryStatusToDoUpdateComponent } from './user-story-status-to-do-update.component';

describe('Component Tests', () => {
  describe('UserStoryStatusToDo Management Update Component', () => {
    let comp: UserStoryStatusToDoUpdateComponent;
    let fixture: ComponentFixture<UserStoryStatusToDoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userStoryStatusService: UserStoryStatusToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStoryStatusToDoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserStoryStatusToDoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStoryStatusToDoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userStoryStatusService = TestBed.inject(UserStoryStatusToDoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const userStoryStatus: IUserStoryStatusToDo = { id: 456 };

        activatedRoute.data = of({ userStoryStatus });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userStoryStatus));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryStatusToDo>>();
        const userStoryStatus = { id: 123 };
        jest.spyOn(userStoryStatusService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStoryStatus });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStoryStatus }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userStoryStatusService.update).toHaveBeenCalledWith(userStoryStatus);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryStatusToDo>>();
        const userStoryStatus = new UserStoryStatusToDo();
        jest.spyOn(userStoryStatusService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStoryStatus });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStoryStatus }));
        saveSubject.complete();

        // THEN
        expect(userStoryStatusService.create).toHaveBeenCalledWith(userStoryStatus);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryStatusToDo>>();
        const userStoryStatus = { id: 123 };
        jest.spyOn(userStoryStatusService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStoryStatus });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userStoryStatusService.update).toHaveBeenCalledWith(userStoryStatus);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
