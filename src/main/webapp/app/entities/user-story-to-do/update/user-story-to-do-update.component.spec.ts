jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserStoryToDoService } from '../service/user-story-to-do.service';
import { IUserStoryToDo, UserStoryToDo } from '../user-story-to-do.model';

import { UserStoryToDoUpdateComponent } from './user-story-to-do-update.component';

describe('Component Tests', () => {
  describe('UserStoryToDo Management Update Component', () => {
    let comp: UserStoryToDoUpdateComponent;
    let fixture: ComponentFixture<UserStoryToDoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userStoryService: UserStoryToDoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserStoryToDoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserStoryToDoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserStoryToDoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userStoryService = TestBed.inject(UserStoryToDoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const userStory: IUserStoryToDo = { id: 456 };

        activatedRoute.data = of({ userStory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userStory));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryToDo>>();
        const userStory = { id: 123 };
        jest.spyOn(userStoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userStoryService.update).toHaveBeenCalledWith(userStory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryToDo>>();
        const userStory = new UserStoryToDo();
        jest.spyOn(userStoryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userStory }));
        saveSubject.complete();

        // THEN
        expect(userStoryService.create).toHaveBeenCalledWith(userStory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserStoryToDo>>();
        const userStory = { id: 123 };
        jest.spyOn(userStoryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userStory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userStoryService.update).toHaveBeenCalledWith(userStory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
