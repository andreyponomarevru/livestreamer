import { logger } from "../../config/logger";
import { User } from "./user";
import { dbConnection } from "../../config/postgres";
import { Permissions } from "../../types";

type IsEmailConfirmedDBResponse = { is_email_confirmed: boolean };
type FindByEmailConfirmationTokenDBResponse = { appuser_id: number };
type UpdateLastLoginTimeDBResponse = { last_login_at: string };
type IsUserDeletedDBResponse = { is_deleted: boolean };
type ConfirmSignUpDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
};
type IsUserExistsDBResponse = { exists: boolean };
type UserPermissionsDBResponse = {
  appuser_id?: number;
  resource: string;
  permissions: string[];
};
interface CreateUserDBResponse {
  appuser_id: number;
}
type ReadUserDBResponse = {
  appuser_id: number;
  username: string;
  email: string;
  password_hash: string;
  is_email_confirmed: boolean;
  is_deleted: boolean;
  created_at: string;
  last_login_at: string;
  display_name: string;
  website_url: string;
  about: string;
  profile_picture_url: string;
  subscription_name: string;
};
type CreateAllowedSettingValueDBResponse = {
  allowed_setting_value: string;
  value: string;
};
type CreateSettingDBResponse = {
  setting_id: number;
  name: string;
  is_constrained: boolean;
  data_type: string;
  value: string;
  min_value: string;
  max_value: string;
};

type UserSetting = {
  userId: number;
  settingId: number;
  allowedSettingValueId: number;
  unconstrainedValue: string | null;
};
type AppSetting = {
  name: string;
  isConstrained: boolean;
  dataType: string;
  allowedSettingValues: string[];
};
type ConfirmedEmail = {
  userId: number;
  username: string;
  email: string;
};
export type SignUpData = {
  email: string;
  username: string;
  password: string;
  roleId: number;
  isEmailConfirmed: boolean;
  emailConfirmationToken: string;
  displayName: string;
  profilePictureUrl: string;
  subscriptionName: "basic" | "unlimited";
  about?: string;
  websiteUrl?: string;
};

export const userRepo = {
  readUser: async function ({
    userId,
    username,
    email,
  }: {
    userId?: number;
    username?: string;
    email?: string;
  }): Promise<Omit<User, "uuid"> | null> {
    const sql = `
      SELECT 
			  appuser_id, 
        username, 
        email, 
        password_hash, 
        created_at, 
        last_login_at, 
        is_email_confirmed, 
        is_deleted,
        display_name,
        website_url,
        about,
        profile_picture_url,
        subscription_name
		  FROM 
        appuser 
		  WHERE 
        appuser_id = $1 OR
        username = $2 OR
        email = $3`;
    const values = [userId, username, email];
    const pool = await dbConnection.open();
    const res = await pool.query<ReadUserDBResponse>(sql, values);

    if (res.rowCount === 0) return null;

    const user = new User({
      userId: res.rows[0].appuser_id,
      email: res.rows[0].email,
      username: res.rows[0].username,
      password: res.rows[0].password_hash,
      createdAt: res.rows[0].created_at,
      lastLoginAt: res.rows[0].last_login_at,
      isEmailConfirmed: res.rows[0].is_email_confirmed,
      isDeleted: res.rows[0].is_deleted,
      displayName: res.rows[0].display_name,
      websiteUrl: res.rows[0].website_url,
      about: res.rows[0].about,
      profilePictureUrl: res.rows[0].profile_picture_url,
      subscriptionName: res.rows[0].subscription_name,
    });

    return user;
  },

  readAllUsers: async function (): Promise<Omit<User, "uuid">[]> {
    const sql = `
      SELECT 
        appuser_id, 
        username, 
        email, 
        password_hash, 
        created_at, 
        last_login_at, 
        is_email_confirmed, 
        is_deleted,
        display_name, 
        website_url, 
        about, 
        profile_picture_url,
        subscription_name 
      FROM
        appuser`;
    const pool = await dbConnection.open();
    const res = await pool.query<ReadUserDBResponse>(sql);

    const users = res.rows.map((user) => {
      return new User({
        userId: user.appuser_id,
        email: user.email,
        username: user.username,
        password: user.password_hash,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
        isEmailConfirmed: user.is_email_confirmed,
        isDeleted: user.is_deleted,
        displayName: user.display_name,
        profilePictureUrl: user.profile_picture_url,
        websiteUrl: user.website_url,
        about: user.about,
        subscriptionName: user.subscription_name,
      });
    });

    return users;
  },

  findByEmailConfirmationToken: async function (
    token: string,
  ): Promise<{ userId: number | null }> {
    const sql =
      "SELECT appuser_id FROM appuser WHERE email_confirmation_token=$1";
    const values = [token];
    const pool = await dbConnection.open();
    const res = await pool.query<FindByEmailConfirmationTokenDBResponse>(
      sql,
      values,
    );

    if (res.rowCount === 0) return { userId: null };
    else return { userId: res.rows[0].appuser_id };
  },

  findByPasswordResetToken: async function (
    token: string,
  ): Promise<{ userId: number | null }> {
    const sql = "SELECT appuser_id FROM appuser WHERE password_reset_token=$1";
    const values = [token];
    const pool = await dbConnection.open();
    const res = await pool.query<{ appuser_id: number }>(sql, values);

    if (res.rowCount === 0) return { userId: null };
    else return { userId: res.rows[0].appuser_id };
  },

  updatePassword: async function ({
    userId,
    newPassword,
  }: {
    userId: number;
    newPassword: string;
  }): Promise<void> {
    const deletePassResetTokenSql =
      "UPDATE appuser SET password_reset_token=NULL WHERE appuser_id=$1";
    const deletePassResetTokenValues = [userId];

    const saveNewPasswordSql = "UPDATE appuser SET password_hash=$1";
    const saveNewPasswordValues = [newPassword];

    const pool = await dbConnection.open();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(deletePassResetTokenSql, deletePassResetTokenValues);
      await client.query(saveNewPasswordSql, saveNewPasswordValues);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error(
        `${__filename}: [updatePassword] ROLLBACK. Can't update password.`,
      );
      throw err;
    } finally {
      client.release();
    }
  },

  updateIsEmailConfirmed: async function (
    userId: number,
    isConfirmed: boolean,
  ): Promise<ConfirmedEmail> {
    const sql = `
      UPDATE
        appuser
      SET 
        is_email_confirmed = $2, 
        email_confirmation_token = NULL
      WHERE 
        appuser_id = $1 
      RETURNING 
        appuser_id, 
        username, 
        email`;
    const values = [userId, isConfirmed];
    const pool = await dbConnection.open();
    const res = await pool.query<ConfirmSignUpDBResponse>(sql, values);

    return {
      userId: res.rows[0].appuser_id,
      username: res.rows[0].username,
      email: res.rows[0].email,
    };
  },

  isUserExists: async function ({
    userId,
    username,
    email,
  }: {
    userId?: number;
    username?: string;
    email?: string;
  }): Promise<boolean> {
    const sql =
      "SELECT \
			EXISTS (\
				SELECT 1 FROM appuser WHERE appuser_id=$1 OR username=$2 OR email=$3\
			)";
    const values = [userId, username, email];
    const pool = await dbConnection.open();
    const res = await pool.query<IsUserExistsDBResponse>(sql, values);

    return res.rows[0].exists;
  },

  isEmailConfirmed: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    const sql =
      "SELECT is_email_confirmed FROM appuser WHERE email=$1 OR appuser_id=$2";
    const values = [email, userId];
    const pool = await dbConnection.open();
    const res = await pool.query<IsEmailConfirmedDBResponse>(sql, values);

    if (
      res.rowCount !== null &&
      res.rowCount > 0 &&
      res.rows[0].is_email_confirmed
    ) {
      return res.rows[0].is_email_confirmed;
    } else {
      return false;
    }
  },

  isUserDeleted: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    const sql =
      "SELECT is_deleted FROM appuser WHERE email=$1 OR appuser_id=$2";
    const values = [email, userId];
    const pool = await dbConnection.open();
    const res = await pool.query<IsUserDeletedDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      return res.rows[0].is_deleted;
    } else {
      throw new Error(
        `No user with email "${email}" or userId "${userId}" in db`,
      );
    }
  },

  savePasswordResetToken: async function ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<void> {
    const sql = "UPDATE appuser SET password_reset_token=$1 WHERE email=$2";
    const values = [token, email];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },

  createUser: async function (
    signupData: SignUpData,
  ): Promise<{ userId: number }> {
    const sql = `
      INSERT INTO
        appuser (
          role_id, 
          username,
          password_hash, 
          email, 
          is_email_confirmed, 
          email_confirmation_token,
          display_name,
          profile_picture_url,
          subscription_name,
          about,
          website_url
        )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING 
        appuser_id`;
    const values = [
      signupData.roleId,
      signupData.username,
      signupData.password,
      signupData.email,
      signupData.isEmailConfirmed,
      signupData.emailConfirmationToken,
      signupData.displayName,
      signupData.profilePictureUrl,
      signupData.subscriptionName,
      signupData.about,
      signupData.websiteUrl,
    ];
    const pool = await dbConnection.open();
    const res = await pool.query<CreateUserDBResponse>(sql, values);

    const user = { userId: res.rows[0].appuser_id };
    return user;
  },

  updateUser: async function ({
    userId,
    username,
    displayName,
    websiteUrl,
    about,
    profilePictureUrl,
    subscriptionName,
  }: {
    userId: number;
    username?: string;
    displayName?: string;
    websiteUrl?: string;
    about?: string;
    profilePictureUrl?: string;
    subscriptionName?: string;
  }): Promise<{
    userId: number;
    email: string;
    username: string;
    permissions: Permissions;
  }> {
    const sql = `
      UPDATE
        appuser
      SET
        username            = COALESCE($2, username),
        display_name        = COALESCE($3, display_name), 
        website_url         = COALESCE($4, website_url),  
        about               = COALESCE($5, about),
        profile_picture_url = COALESCE($6, profile_picture_url),
        subscription_name   = COALESCE($7, subscription_name)
      WHERE
        appuser_id = $1
      RETURNING
        appuser_id, 
        username, 
        email`;
    const values = [
      userId,
      username,
      displayName,
      websiteUrl,
      about,
      profilePictureUrl,
      subscriptionName,
    ];
    const pool = await dbConnection.open();
    const res = await pool.query<ReadUserDBResponse>(sql, values);

    const permissions = await this.readUserPermissions(userId);
    const user = {
      userId: res.rows[0].appuser_id,
      email: res.rows[0].email,
      username: res.rows[0].username,
      permissions,
    };

    return user;
  },

  destroyUser: async function (userId: number): Promise<void> {
    const sql = "UPDATE appuser SET is_deleted=true WHERE appuser_id=$1";
    const values = [userId];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },

  updateLastLoginTime: async function (userId: number) {
    const sql =
      "UPDATE appuser SET last_login_at=NOW() WHERE appuser_id = $1 RETURNING last_login_at";
    const values = [userId];
    const pool = await await dbConnection.open();
    const res = await pool.query<UpdateLastLoginTimeDBResponse>(sql, values);

    return { lastLoginAt: res.rows[0].last_login_at };
  },

  assignSettingToUser: async function (usetSetting: UserSetting) {
    const sql = `
      INSERT INTO
        appuser_setting (
          appuser_id,
          setting_id,
          allowed_setting_value_id,
          unconstrained_value
        )
      VALUES ($1, $2, $3, $4)`;
    const values = [
      usetSetting.userId,
      usetSetting.settingId,
      usetSetting.allowedSettingValueId,
      usetSetting.unconstrainedValue,
    ];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },

  createAllowedSettingValue: async function (
    settingId: number,
    valueName: string,
  ): Promise<void> {
    const sql = `
      INSERT INTO 
        allowed_setting_value (
          setting_id, 
          value
        )
      VALUES (
        $1, $2
      ) 
      RETURNING
        *`;
    const values = [settingId, valueName];
    const pool = await dbConnection.open();
    await pool.query<CreateAllowedSettingValueDBResponse>(sql, values);
  },

  createSetting: async function (setting: AppSetting) {
    const sql = `
      INSERT INTO 
        setting (
          name, 
          is_constrained, 
          data_type
        ) 
      VALUES (
        $1, $2, $3
      ) 
      RETURNING 
        *`;
    const values = [setting.name, setting.isConstrained, setting.dataType];
    const pool = await dbConnection.open();
    const settingRes = await pool.query<CreateSettingDBResponse>(sql, values);
    const settingId = settingRes.rows[0].setting_id;

    for (const valueName of setting.allowedSettingValues) {
      await this.createAllowedSettingValue(settingId, valueName);
    }
  },

  // TODO: move this function to authorization model module and retrieve permissions via service layer
  readUserPermissions: async function (userId: number): Promise<Permissions> {
    const sql = `
      SELECT 
        re.name AS resource, 
        ARRAY_AGG(pe.name ORDER BY pe.name) AS permissions 
      FROM appuser AS us 
        INNER JOIN role_resource_permission AS r_r_p 
          ON us.role_id = r_r_p.role_id 
        INNER JOIN role AS rol 
          ON rol.role_id = r_r_p.role_id 
        INNER JOIN permission AS pe 
          ON pe.permission_id = r_r_p.permission_id 
        INNER JOIN resource AS re 
          ON re.resource_id = r_r_p.resource_id 
      WHERE 
        us.appuser_id = $1 
      GROUP BY 
        r_r_p.resource_id, 
        re.name, 
        us.username`;
    const values = [userId];
    const pool = await dbConnection.open();
    const res = await pool.query<UserPermissionsDBResponse>(sql, values);

    const permissions: Permissions = {};
    res.rows.forEach((row) => {
      permissions[row.resource] = row.permissions;
    });

    return permissions;
  },
};
