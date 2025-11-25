import { type Permissions } from "../../types";

interface Profile {
  uuid?: string;
  userId: number;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  permissions?: Permissions;
  displayName: string;
  websiteUrl: string;
  about: string;
  profilePictureUrl: string;
  subscriptionName: string;
}

export class User {
  uuid?: string;
  readonly userId!: number;
  readonly username!: string;
  readonly email!: string;
  readonly password!: string;
  readonly createdAt!: string;
  lastLoginAt?: string;
  readonly isEmailConfirmed!: boolean;
  readonly isDeleted!: boolean;
  readonly permissions?: Permissions;
  readonly displayName!: string;
  readonly websiteUrl!: string;
  readonly about!: string;
  readonly profilePictureUrl!: string;
  readonly subscriptionName!: string;

  constructor(profile: Profile) {
    Object.assign(this, profile);
  }
}
