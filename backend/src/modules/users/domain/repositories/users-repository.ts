import type { User } from "../entities/user.js";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: User): Promise<User>;
}
