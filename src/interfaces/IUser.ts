import { Room } from "./Room";

export interface IUser {
  hasNewMessages: boolean;
  chatHistory: any;
  username: string;
  socketId: string;
  room: Room;
}
