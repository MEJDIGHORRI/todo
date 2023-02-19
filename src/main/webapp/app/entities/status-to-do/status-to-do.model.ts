import { IUserStoryToDo } from 'app/entities/user-story-to-do/user-story-to-do.model';

export interface IStatusToDo {
  id?: number;
  state?: string;
  userStory?: IUserStoryToDo | null;
}

export class StatusToDo implements IStatusToDo {
  constructor(public id?: number, public state?: string, public userStory?: IUserStoryToDo | null) {}
}

export function getStatusToDoIdentifier(status: IStatusToDo): number | undefined {
  return status.id;
}
