import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStatusToDo, getStatusToDoIdentifier } from '../status-to-do.model';

export type EntityResponseType = HttpResponse<IStatusToDo>;
export type EntityArrayResponseType = HttpResponse<IStatusToDo[]>;

@Injectable({ providedIn: 'root' })
export class StatusToDoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(status: IStatusToDo): Observable<EntityResponseType> {
    return this.http.post<IStatusToDo>(this.resourceUrl, status, { observe: 'response' });
  }

  update(status: IStatusToDo): Observable<EntityResponseType> {
    return this.http.put<IStatusToDo>(`${this.resourceUrl}/${getStatusToDoIdentifier(status) as number}`, status, { observe: 'response' });
  }

  partialUpdate(status: IStatusToDo): Observable<EntityResponseType> {
    return this.http.patch<IStatusToDo>(`${this.resourceUrl}/${getStatusToDoIdentifier(status) as number}`, status, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStatusToDo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStatusToDo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStatusToDoToCollectionIfMissing(
    statusCollection: IStatusToDo[],
    ...statusesToCheck: (IStatusToDo | null | undefined)[]
  ): IStatusToDo[] {
    const statuses: IStatusToDo[] = statusesToCheck.filter(isPresent);
    if (statuses.length > 0) {
      const statusCollectionIdentifiers = statusCollection.map(statusItem => getStatusToDoIdentifier(statusItem)!);
      const statusesToAdd = statuses.filter(statusItem => {
        const statusIdentifier = getStatusToDoIdentifier(statusItem);
        if (statusIdentifier == null || statusCollectionIdentifiers.includes(statusIdentifier)) {
          return false;
        }
        statusCollectionIdentifiers.push(statusIdentifier);
        return true;
      });
      return [...statusesToAdd, ...statusCollection];
    }
    return statusCollection;
  }
}
