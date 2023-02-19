import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserStoryToDo, getUserStoryToDoIdentifier } from '../user-story-to-do.model';

export type EntityResponseType = HttpResponse<IUserStoryToDo>;
export type EntityArrayResponseType = HttpResponse<IUserStoryToDo[]>;

@Injectable({ providedIn: 'root' })
export class UserStoryToDoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-stories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userStory: IUserStoryToDo): Observable<EntityResponseType> {
    return this.http.post<IUserStoryToDo>(this.resourceUrl, userStory, { observe: 'response' });
  }

  update(userStory: IUserStoryToDo): Observable<EntityResponseType> {
    return this.http.put<IUserStoryToDo>(`${this.resourceUrl}/${getUserStoryToDoIdentifier(userStory) as number}`, userStory, {
      observe: 'response',
    });
  }

  partialUpdate(userStory: IUserStoryToDo): Observable<EntityResponseType> {
    return this.http.patch<IUserStoryToDo>(`${this.resourceUrl}/${getUserStoryToDoIdentifier(userStory) as number}`, userStory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserStoryToDo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserStoryToDo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserStoryToDoToCollectionIfMissing(
    userStoryCollection: IUserStoryToDo[],
    ...userStoriesToCheck: (IUserStoryToDo | null | undefined)[]
  ): IUserStoryToDo[] {
    const userStories: IUserStoryToDo[] = userStoriesToCheck.filter(isPresent);
    if (userStories.length > 0) {
      const userStoryCollectionIdentifiers = userStoryCollection.map(userStoryItem => getUserStoryToDoIdentifier(userStoryItem)!);
      const userStoriesToAdd = userStories.filter(userStoryItem => {
        const userStoryIdentifier = getUserStoryToDoIdentifier(userStoryItem);
        if (userStoryIdentifier == null || userStoryCollectionIdentifiers.includes(userStoryIdentifier)) {
          return false;
        }
        userStoryCollectionIdentifiers.push(userStoryIdentifier);
        return true;
      });
      return [...userStoriesToAdd, ...userStoryCollection];
    }
    return userStoryCollection;
  }
}
