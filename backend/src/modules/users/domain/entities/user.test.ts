import { describe, expect, it } from "vitest";

import { User } from "./user.js";

describe("User", () => {
  it("creates a user with normalized fields", () => {
    const user = User.create({
      name: " Tiago ",
      email: " TIAGO@EXAMPLE.COM ",
      passwordHash: "hashed:123456",
    });

    expect(user.name).toBe("Tiago");
    expect(user.email).toBe("tiago@example.com");
    expect(user.passwordHash).toBe("hashed:123456");
  });

  it("restores a persisted user with identity", () => {
    const user = User.restore({
      id: "user-1",
      name: " Tiago ",
      email: " TIAGO@EXAMPLE.COM ",
      passwordHash: "hashed:123456",
    });

    expect(user.id).toBe("user-1");
    expect(user.name).toBe("Tiago");
    expect(user.email).toBe("tiago@example.com");
  });
});
