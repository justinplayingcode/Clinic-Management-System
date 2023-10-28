import { ClientSession } from "mongoose";
import User from "./user.schema";
import UserRepository from "./user.repository";

export default class UserService {

  private _userRepository;

  constructor() {
    this._userRepository = new UserRepository(User);
  }

  public createUser = async (accountid, session: ClientSession) => {
    try {
      const newUser = {
        accountid
      }
      return this._userRepository.create(newUser, session);
    } catch (error) {
      throw error
    }
  }
}