import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserStoryStatusToDo, UserStoryStatusToDo } from '../user-story-status-to-do.model';

import { UserStoryStatusToDoService } from './user-story-status-to-do.service';

describe('Service Tests', () => {
  describe('UserStoryStatusToDo Service', () => {
    let service: UserStoryStatusToDoService;
    let httpMock: HttpTestingController;
    let elemDefault: IUserStoryStatusToDo;
    let expectedResult: IUserStoryStatusToDo | IUserStoryStatusToDo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UserStoryStatusToDoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        userId: 0,
        statusState: 'AAAAAAA',
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

      it('should create a UserStoryStatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UserStoryStatusToDo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UserStoryStatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            userId: 1,
            statusState: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UserStoryStatusToDo', () => {
        const patchObject = Object.assign({}, new UserStoryStatusToDo());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UserStoryStatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            userId: 1,
            statusState: 'BBBBBB',
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

      it('should delete a UserStoryStatusToDo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUserStoryStatusToDoToCollectionIfMissing', () => {
        it('should add a UserStoryStatusToDo to an empty array', () => {
          const userStoryStatus: IUserStoryStatusToDo = { id: 123 };
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing([], userStoryStatus);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStoryStatus);
        });

        it('should not add a UserStoryStatusToDo to an array that contains it', () => {
          const userStoryStatus: IUserStoryStatusToDo = { id: 123 };
          const userStoryStatusCollection: IUserStoryStatusToDo[] = [
            {
              ...userStoryStatus,
            },
            { id: 456 },
          ];
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing(userStoryStatusCollection, userStoryStatus);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UserStoryStatusToDo to an array that doesn't contain it", () => {
          const userStoryStatus: IUserStoryStatusToDo = { id: 123 };
          const userStoryStatusCollection: IUserStoryStatusToDo[] = [{ id: 456 }];
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing(userStoryStatusCollection, userStoryStatus);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStoryStatus);
        });

        it('should add only unique UserStoryStatusToDo to an array', () => {
          const userStoryStatusArray: IUserStoryStatusToDo[] = [{ id: 123 }, { id: 456 }, { id: 99022 }];
          const userStoryStatusCollection: IUserStoryStatusToDo[] = [{ id: 123 }];
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing(userStoryStatusCollection, ...userStoryStatusArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const userStoryStatus: IUserStoryStatusToDo = { id: 123 };
          const userStoryStatus2: IUserStoryStatusToDo = { id: 456 };
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing([], userStoryStatus, userStoryStatus2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(userStoryStatus);
          expect(expectedResult).toContain(userStoryStatus2);
        });

        it('should accept null and undefined values', () => {
          const userStoryStatus: IUserStoryStatusToDo = { id: 123 };
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing([], null, userStoryStatus, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(userStoryStatus);
        });

        it('should return initial array if no UserStoryStatusToDo is added', () => {
          const userStoryStatusCollection: IUserStoryStatusToDo[] = [{ id: 123 }];
          expectedResult = service.addUserStoryStatusToDoToCollectionIfMissing(userStoryStatusCollection, undefined, null);
          expect(expectedResult).toEqual(userStoryStatusCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
