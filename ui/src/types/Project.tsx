import { User } from "./User"

export interface Project {
  id: string,
  name: string,
  userEmail: string,

  collaboratorList: Array<User>,
  projectUUID: ProjectUUID,
}

export interface ProjectUUID {
  uuid1: string,
  uuid2: string,
  uuid3: string,
  uuid4: string,
  uuid5: string,
  uuid6: string,
  uuid7: string,
  uuid8: string
}