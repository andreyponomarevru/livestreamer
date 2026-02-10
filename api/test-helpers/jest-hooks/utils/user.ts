import { dbConnection } from "../../../src/config/postgres";
import { authnService } from "../../../src/services/authn";

// USERS USED ONLY FOR TESTING

type User = {
  userId?: number;
  roleName: string;
  username: string;
  password: string;
  passwordHash?: string;
  email: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  displayName: string;
  websiteUrl?: string;
  about?: string;
  profilePictureUrl: string;
  subscriptionName?: string;
};

let superadminUser: User = {
  roleName: "superadmin",
  username: process.env.HAL_USERNAME || "",
  password: process.env.HAL_PASSWORD || "",
  email: process.env.HAL_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
  displayName: process.env.HAL_USERNAME || "",
  websiteUrl: "http://test.ru",
  about: "A few words",
  profilePictureUrl: "ava.jpg",
  subscriptionName: "unlimited",
};
let broadcasterUser: User = {
  roleName: "streamer",
  username: process.env.ANDREYPONOMAREV_USERNAME || "",
  password: process.env.ANDREYPONOMAREV_PASSWORD || "",
  email: process.env.ANDREYPONOMAREV_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
  displayName: process.env.ANDREYPONOMAREV_USERNAME || "",
  websiteUrl: "http://test2.ru",
  about: "A few words more",
  profilePictureUrl: "ava2.jpg",
  subscriptionName: "basic",
};

async function seed({
  username,
  roleName,
  email,
  password,
  isEmailConfirmed,
  isDeleted,
  displayName,
  websiteUrl,
  about,
  profilePictureUrl,
  subscriptionName,
}: User): Promise<{ userId: number; passwordHash: string }> {
  const pool = await dbConnection.open();

  const selectRoleIdRes = await pool.query(
    `SELECT role_id FROM role WHERE name = '${roleName}'`,
  );

  const passwordHash = await authnService.hashPassword(password);

  const sql = `
      INSERT INTO appuser (
        role_id, 
        username, 
        password_hash, 
        email, 
        is_email_confirmed, 
        is_deleted,
        display_name,
        website_url,
        about,
        profile_picture_url,
        subscription_name
      ) 
      VALUES (
        ${selectRoleIdRes.rows[0].role_id}, 
        '${username}', 
        '${passwordHash}', 
        '${email}', 
        ${isEmailConfirmed}, 
        ${isDeleted},
        '${displayName}',
        '${websiteUrl}', 
        '${about}', 
        '${profilePictureUrl}', 
        '${subscriptionName}'
      )
      RETURNING appuser_id
  `;

  const insertUserRes = await pool.query<{ appuser_id: number }>(sql);

  return { userId: insertUserRes.rows[0].appuser_id, passwordHash };
}

async function createUsers() {
  const superadmin = await seed(superadminUser);
  const broadcaster = await seed(broadcasterUser);

  superadminUser = {
    ...superadminUser,
    userId: superadmin.userId,
    passwordHash: superadmin.passwordHash,
  };
  broadcasterUser = {
    ...broadcasterUser,
    userId: broadcaster.userId,
    passwordHash: broadcaster.passwordHash,
  };
}

// Now you can import user for the specific test (integration or e2e) at the top of the test file e.g. import { defaultUser: { roleNameSuperadmin } } from "..." and use the properties of the imported user in a test e.g.
//  const response = await request(app)
//    .put(`/users/${user.username}`)
//    .send({ email: user.email, password: "a_password" })
export { superadminUser, broadcasterUser, createUsers };
