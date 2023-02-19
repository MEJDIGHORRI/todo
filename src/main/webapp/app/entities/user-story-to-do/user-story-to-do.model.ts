import { IStatusToDo } from 'app/entities/status-to-do/status-to-do.model';

export interface IUserStoryToDo {
  id?: number;
  title?: string;
  description?: string | null;
  status?: IStatusToDo | null;
}

export class UserStoryToDo implements IUserStoryToDo {
  constructor(public id?: number, public title?: string, public description?: string | null, public status?: IStatusToDo | null) {}
}

export function getUserStoryToDoIdentifier(userStory: IUserStoryToDo): number | undefined {
  return userStory.id;
}
