import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserStoryStatusToDo, getUserStoryStatusToDoIdentifier } from '../user-story-status-to-do.model';

export type EntityResponseType = HttpResponse<IUserStoryStatusToDo>;
export type EntityArrayResponseType = HttpResponse<IUserStoryStatusToDo[]>;

@Injectable({ providedIn: 'root' })
export class UserStoryStatusToDoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-story-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userStoryStatus: IUserStoryStatusToDo): Observable<EntityResponseType> {
    return this.http.post<IUserStoryStatusToDo>(this.resourceUrl, userStoryStatus, { observe: 'response' });
  }

  update(userStoryStatus: IUserStoryStatusToDo): Observable<EntityResponseType> {
    return this.http.put<IUserStoryStatusToDo>(
      `${this.resourceUrl}/${getUserStoryStatusToDoIdentifier(userStoryStatus) as number}`,
      userStoryStatus,
      { observe: 'response' }
    );
  }

  partialUpdate(userStoryStatus: IUserStoryStatusToDo): Observable<EntityResponseType> {
    return this.http.patch<IUserStoryStatusToDo>(
      `${this.resourceUrl}/${getUserStoryStatusToDoIdentifier(userStoryStatus) as number}`,
      userStoryStatus,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserStoryStatusToDo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserStoryStatusToDo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserStoryStatusToDoToCollectionIfMissing(
    userStoryStatusCollection: IUserStoryStatusToDo[],
    ...userStoryStatusesToCheck: (IUserStoryStatusToDo | null | undefined)[]
  ): IUserStoryStatusToDo[] {
    const userStoryStatuses: IUserStoryStatusToDo[] = userStoryStatusesToCheck.filter(isPresent);
    if (userStoryStatuses.length > 0) {
      const userStoryStatusCollectionIdentifiers = userStoryStatusCollection.map(
        userStoryStatusItem => getUserStoryStatusToDoIdentifier(userStoryStatusItem)!
      );
      const userStoryStatusesToAdd = userStoryStatuses.filter(userStoryStatusItem => {
        const userStoryStatusIdentifier = getUserStoryStatusToDoIdentifier(userStoryStatusItem);
        if (userStoryStatusIdentifier == null || userStoryStatusCollectionIdentifiers.includes(userStoryStatusIdentifier)) {
          return false;
        }
        userStoryStatusCollectionIdentifiers.push(userStoryStatusIdentifier);
        return true;
      });
      return [...userStoryStatusesToAdd, ...userStoryStatusCollection];
    }
    return userStoryStatusCollection;
  }
}
