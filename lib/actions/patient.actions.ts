'use server';

import { ID, Query } from 'node-appwrite';

import { users } from '@/lib/appwrite.config';
import { parseStringify } from '@/lib/utils';

export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return newUser;
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])]);

      return documents?.users[0];
    }

    console.error('An error occurred while creating a new user:", error');
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};
