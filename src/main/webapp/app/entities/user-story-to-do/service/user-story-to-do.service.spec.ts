import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserStoryToDo, UserStoryToDo } from '../user-story-to-do.model';

import { UserStoryToDoService } from './user-story-to-do.service';

describe('Service Tests', () => {
  describe('UserStoryToDo Service', () => {
    let service: UserStoryToDoService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserStoryToDo;
    let expectedResult: IUserStoryToDo | IUserStoryToDo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserStoryToDoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a UserStoryToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserStoryToDo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserStoryToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserStoryToDo', () => {
        const patchObject = Object.assign({}, new UserStoryToDo());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserStoryToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a UserStoryToDo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserStoryToDoToCollectionIfMissing', () => {
        it('should add a UserStoryToDo to an empty array', () => {
          const userStory: IUserStoryToDo = { id: 123 };
          expectedResult = service.addUserStoryToDoToCollectionIfMissing([], userStory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStory);
        });

        it('should not add a UserStoryToDo to an array that contains it', () => {
          const userStory: IUserStoryToDo = { id: 123 };
          const userStoryCollection: IUserStoryToDo[] = [
            {
              ...userStory,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserStoryToDoToCollectionIfMissing(userStoryCollection, userStory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserStoryToDo to an array that doesn't contain it", () => {
          const userStory: IUserStoryToDo = { id: 123 };
          const userStoryCollection: IUserStoryToDo[] = [{ id: 456 }];
          expectedResult = service.addUserStoryToDoToCollectionIfMissing(userStoryCollection, userStory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStory);
        });

        it('should add only unique UserStoryToDo to an array', () => {
          const userStoryArray: IUserStoryToDo[] = [{ id: 123 }, { id: 456 }, { id: 27515 }];
          const userStoryCollection: IUserStoryToDo[] = [{ id: 123 }];
          expectedResult = service.addUserStoryToDoToCollectionIfMissing(userStoryCollection, ...userStoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userStory: IUserStoryToDo = { id: 123 };
          const userStory2: IUserStoryToDo = { id: 456 };
          expectedResult = service.addUserStoryToDoToCollectionIfMissing([], userStory, userStory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStory);
          expect(expectedResult).toContain(userStory2);
        });

        it('should accept null and undefined values', () => {
          const userStory: IUserStoryToDo = { id: 123 };
          expectedResult = service.addUserStoryToDoToCollectionIfMissing([], null, userStory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStory);
        });

        it('should return initial array if no UserStoryToDo is added', () => {
          const userStoryCollection: IUserStoryToDo[] = [{ id: 123 }];
          expectedResult = service.addUserStoryToDoToCollectionIfMissing(userStoryCollection, undefined, null);
          expect(expectedResult).toEqual(userStoryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
