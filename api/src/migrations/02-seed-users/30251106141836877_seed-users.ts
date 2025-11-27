import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";
import { dbConnection } from "../../config/postgres";
import { authnService } from "../../services/authn";

export const shorthands: ColumnDefinitions | undefined = undefined;

// THESE DEFAULT USERS ARE USED IN PRODUCTION AS WELL

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
  websiteUrl: string;
  about: string;
  profilePictureUrl: string;
};

let superadminUser: User = {
  roleName: "superadmin",
  username: process.env.HAL_USERNAME || "",
  password: process.env.HAL_PASSWORD || "",
  email: process.env.HAL_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
  displayName: process.env.HAL_USERNAME || "",
  websiteUrl: "http://test-url-a.ru",
  about: "A few lines about myself",
  profilePictureUrl: "/mnt/d587g587ewrfv/profile-pics/1.jpg",
};
let streamerUser: User = {
  roleName: "streamer",
  username: process.env.ANDREYPONOMAREV_USERNAME || "",
  password: process.env.ANDREYPONOMAREV_PASSWORD || "",
  email: process.env.ANDREYPONOMAREV_EMAIL || "",
  isEmailConfirmed: true,
  isDeleted: false,
  displayName: process.env.ANDREYPONOMAREV_USERNAME || "",
  websiteUrl: "http://test-url-b.ru",
  about: "A few more lines about myself",
  profilePictureUrl: "/mnt/d587g587ewrfv/profile-pics/2.jpg",
};

async function seedUser(
  user: User,
): Promise<{ userId: number; passwordHash: string }> {
  const pool = await dbConnection.open();

  const selectRoleIdRes = await pool.query(
    `SELECT role_id FROM role WHERE name = '${user.roleName}'`,
  );

  const passwordHash = await authnService.hashPassword(user.password);

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
        profile_picture_url
      ) 
      VALUES (
        ${selectRoleIdRes.rows[0].role_id}, 
        '${user.username}', 
        '${passwordHash}', 
        '${user.email}', 
        ${user.isEmailConfirmed}, 
        ${user.isDeleted},
        '${user.displayName}',
        '${user.websiteUrl}',
        '${user.about}',
        '${user.profilePictureUrl}'
      )
      RETURNING
        appuser_id
  `;

  const insertUserRes = await pool.query<{ appuser_id: number }>(sql);

  return { userId: insertUserRes.rows[0].appuser_id, passwordHash };
}

export async function up(pgm: MigrationBuilder): Promise<void> {
  const superadmin = await seedUser(superadminUser);
  const broadcaster = await seedUser(streamerUser);

  superadminUser = {
    ...superadminUser,
    userId: superadmin.userId,
    passwordHash: superadmin.passwordHash,
  };
  streamerUser = {
    ...streamerUser,
    userId: broadcaster.userId,
    passwordHash: broadcaster.passwordHash,
  };
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("TRUNCATE TABLE appuser RESTART IDENTITY CASCADE");
}
