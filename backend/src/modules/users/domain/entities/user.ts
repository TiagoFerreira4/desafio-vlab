interface UserProps {
  id: string | null;
  name: string;
  email: string;
  passwordHash: string;
}

interface UserCreateProps {
  name: string;
  email: string;
  passwordHash: string;
}

interface UserRestoreProps extends UserCreateProps {
  id: string;
}

function normalizeUserProps(input: UserCreateProps) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
  };
}

export class User {
  private constructor(private props: UserProps) {}

  static create(input: UserCreateProps) {
    return new User({
      id: null,
      ...normalizeUserProps(input),
    });
  }

  static restore(input: UserRestoreProps) {
    return new User({
      id: input.id,
      ...normalizeUserProps(input),
    });
  }

  get id() {
    if (!this.props.id) {
      throw new Error("User id is not set.");
    }

    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }
}
