import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStatusToDo, StatusToDo } from '../status-to-do.model';

import { StatusToDoService } from './status-to-do.service';

describe('Service Tests', () => {
  describe('StatusToDo Service', () => {
    let service: StatusToDoService;
    let httpMock: HttpTestingController;
    let elemDefault: IStatusToDo;
    let expectedResult: IStatusToDo | IStatusToDo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(StatusToDoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        state: 'AAAAAAA',
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

      it('should create a StatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new StatusToDo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a StatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            state: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a StatusToDo', () => {
        const patchObject = Object.assign(
          {
            state: 'BBBBBB',
          },
          new StatusToDo()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of StatusToDo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            state: 'BBBBBB',
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

      it('should delete a StatusToDo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addStatusToDoToCollectionIfMissing', () => {
        it('should add a StatusToDo to an empty array', () => {
          const status: IStatusToDo = { id: 123 };
          expectedResult = service.addStatusToDoToCollectionIfMissing([], status);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(status);
        });

        it('should not add a StatusToDo to an array that contains it', () => {
          const status: IStatusToDo = { id: 123 };
          const statusCollection: IStatusToDo[] = [
            {
              ...status,
            },
            { id: 456 },
          ];
          expectedResult = service.addStatusToDoToCollectionIfMissing(statusCollection, status);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a StatusToDo to an array that doesn't contain it", () => {
          const status: IStatusToDo = { id: 123 };
          const statusCollection: IStatusToDo[] = [{ id: 456 }];
          expectedResult = service.addStatusToDoToCollectionIfMissing(statusCollection, status);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(status);
        });

        it('should add only unique StatusToDo to an array', () => {
          const statusArray: IStatusToDo[] = [{ id: 123 }, { id: 456 }, { id: 98398 }];
          const statusCollection: IStatusToDo[] = [{ id: 123 }];
          expectedResult = service.addStatusToDoToCollectionIfMissing(statusCollection, ...statusArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const status: IStatusToDo = { id: 123 };
          const status2: IStatusToDo = { id: 456 };
          expectedResult = service.addStatusToDoToCollectionIfMissing([], status, status2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(status);
          expect(expectedResult).toContain(status2);
        });

        it('should accept null and undefined values', () => {
          const status: IStatusToDo = { id: 123 };
          expectedResult = service.addStatusToDoToCollectionIfMissing([], null, status, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(status);
        });

        it('should return initial array if no StatusToDo is added', () => {
          const statusCollection: IStatusToDo[] = [{ id: 123 }];
          expectedResult = service.addStatusToDoToCollectionIfMissing(statusCollection, undefined, null);
          expect(expectedResult).toEqual(statusCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
