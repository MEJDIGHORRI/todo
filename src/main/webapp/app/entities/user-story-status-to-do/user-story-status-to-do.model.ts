export interface IUserStoryStatusToDo {
  id?: number;
  userId?: number;
  statusState?: string;
}

export class UserStoryStatusToDo implements IUserStoryStatusToDo {
  constructor(public id?: number, public userId?: number, public statusState?: string) {}
}

export function getUserStoryStatusToDoIdentifier(userStoryStatus: IUserStoryStatusToDo): number | undefined {
  return userStoryStatus.id;
}
