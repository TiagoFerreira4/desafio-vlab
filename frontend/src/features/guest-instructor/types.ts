export type GuestInstructor = {
  name: string;
  email: string;
  avatarUrl: string;
  nationality: string;
};

export type RandomUserApiResponse = {
  results?: Array<{
    name?: {
      first?: string;
      last?: string;
    };
    email?: string;
    picture?: {
      large?: string;
    };
    nat?: string;
  }>;
};
