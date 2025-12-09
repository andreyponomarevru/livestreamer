-- Up Migration

CREATE TABLE IF NOT EXISTS role (
  PRIMARY KEY (role_id),
  role_id              integer                     NOT NULL,
  name                 varchar(30)                 NOT NULL, 
																									 UNIQUE (name), 
																									 CHECK (name != '')
);

  

CREATE TABLE IF NOT EXISTS resource (
  PRIMARY KEY (resource_id),
  resource_id          integer                     GENERATED ALWAYS AS IDENTITY,
  name                 varchar(30)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS permission (
  PRIMARY KEY (permission_id),
  permission_id        integer                     GENERATED ALWAYS AS IDENTITY,
  name                 varchar(70)                 NOT NULL, 
	                                                 UNIQUE (name), 
																									 CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS role_resource_permission (
  PRIMARY KEY (role_id, resource_id, permission_id),
  role_id              integer                     NOT NULL,
  resource_id          integer                     NOT NULL,
  permission_id        integer                     NOT NULL,
  
  FOREIGN KEY (role_id) REFERENCES role (role_id)
	  ON UPDATE NO ACTION 
		ON DELETE CASCADE,
	FOREIGN KEY (resource_id) REFERENCES resource (resource_id) 
		ON UPDATE NO ACTION
		ON DELETE RESTRICT,
	FOREIGN KEY (permission_id) REFERENCES permission (permission_id) 
		ON UPDATE NO ACTION
		ON DELETE RESTRICT     
);

CREATE INDEX 
	role_resource_permission__role_idx 
ON 
	role_resource_permission (role_id ASC);

CREATE INDEX 
	role_resource_permission__resource_idx 
ON
  role_resource_permission (resource_id ASC);

CREATE INDEX 
	role_resource_permission__permission_idx 
ON 
	role_resource_permission (permission_id ASC);



CREATE TABLE IF NOT EXISTS appuser (
  PRIMARY KEY (appuser_id),
  appuser_id          integer                      GENERATED ALWAYS AS IDENTITY,
  role_id             integer                      NOT NULL,
  username            varchar(16)                  NOT NULL,
                                                   UNIQUE (username),
																									 CHECK (username != ''),
  password_hash       varchar(72)                  NOT NULL,
  email               varchar(320)                 NOT NULL, 
	                                                 UNIQUE (email), 
																									 CHECK (email != ''),
  created_at          timestamp with time zone     DEFAULT CURRENT_TIMESTAMP,
  last_login_at       timestamp with time zone     NULL,
  is_deleted          boolean                      DEFAULT FALSE,
  is_email_confirmed  boolean                      DEFAULT FALSE, 
	email_confirmation_token  varchar(128)           DEFAULT NULL,
	password_reset_token      varchar(128)           DEFAULT NULL,
  display_name        varchar(32)                  NOT NULL CHECK (display_name != ''),
  website_url         text                         NOT NULL DEFAULT '',
  about               text                         NOT NULL DEFAULT '',
  profile_picture_url text                         NOT NULL DEFAULT '',
  subscription_name   varchar(16)                  NOT NULL DEFAULT '',

  FOREIGN KEY (role_id) REFERENCES role (role_id)
	  ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

CREATE INDEX 
	appuser__role_id_idx 
ON 
	appuser (role_id ASC);



CREATE TABLE IF NOT EXISTS broadcast (
  PRIMARY KEY (broadcast_id),
  broadcast_id        integer                     GENERATED ALWAYS AS IDENTITY,
  appuser_id          integer                     NOT NULL,
  title               varchar(70)                 NOT NULL, 
																									CHECK (title != ''),
  start_at            timestamp with time zone    DEFAULT NULL,
  end_at              timestamp with time zone    DEFAULT NULL,
  artwork_url         text                        DEFAULT '',
  description         text                        DEFAULT '',
  listener_peak_count integer                     DEFAULT 0,
  is_visible          boolean                     DEFAULT TRUE,
                                                  CHECK (is_visible != NULL),

  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE                                                
);



CREATE TABLE IF NOT EXISTS chat_message (
  PRIMARY KEY (chat_message_id),
  chat_message_id     integer                      GENERATED ALWAYS AS IDENTITY,
  appuser_id          integer                      NOT NULL,
  broadcast_id        integer                      NOT NULL,
  created_at          timestamp with time zone     DEFAULT CURRENT_TIMESTAMP,
  message             varchar(500)                 NOT NULL, 
	                                                 CHECK (message != ''),
  
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (broadcast_id) REFERENCES broadcast (broadcast_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);

CREATE INDEX 
	chat_message__appuser_id_idx 
ON 
	chat_message (appuser_id ASC);

CREATE INDEX 
	chat_message__created_at_idx 
ON 
	chat_message (created_at DESC);



CREATE TABLE IF NOT EXISTS chat_message_like (
  PRIMARY KEY (chat_message_id, appuser_id),
  chat_message_id      integer                     NOT NULL, 
  appuser_id           integer                     NOT NULL,
  
  FOREIGN KEY (chat_message_id) REFERENCES chat_message (chat_message_id)
	  ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
	  ON UPDATE NO ACTION
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS broadcast_like (
  PRIMARY KEY (broadcast_id, appuser_id),
  broadcast_id         integer                       NOT NULL,
  appuser_id           integer                       NOT NULL,
  count                integer                       DEFAULT 0,
  created_at           timestamp with time zone      DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (broadcast_id) REFERENCES broadcast (broadcast_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE,
  FOREIGN KEY (appuser_id) REFERENCES appuser (appuser_id)
    ON UPDATE NO ACTION  
		ON DELETE RESTRICT
);



--
-- Create Views
--

CREATE VIEW view_broadcast AS
SELECT
	br.broadcast_id,
  br.appuser_id,
  a_u.username,
	br.title,
	br.description,
	br.start_at,
	br.end_at,
	br.listener_peak_count,
	br.artwork_url,
	br.is_visible,
	SUM( COALESCE(br_li.count, 0) ) AS like_count
FROM broadcast AS br
  FULL OUTER JOIN
    broadcast_like AS br_li
  ON
    br_li.broadcast_id = br.broadcast_id
  INNER JOIN 
    appuser AS a_u
  ON
    a_u.appuser_id = br.appuser_id
  GROUP BY
    br.broadcast_id,
    a_u.username
  ORDER BY
    start_at,
    br.broadcast_id;



CREATE VIEW view_role_permissions AS
SELECT
	ro.role_id,
	re.name AS resource,
	array_agg(pe.name) AS permissions
FROM role AS ro
	INNER JOIN role_resource_permission AS r_r_p
		ON ro.role_id = r_r_p.role_id
	INNER JOIN permission AS pe
		ON pe.permission_id = r_r_p.permission_id
	INNER JOIN resource AS re
		ON re.resource_id = r_r_p.resource_id
GROUP BY
	r_r_p.resource_id,
	ro.name,
	ro.role_id,
	re.name
ORDER BY
	role_id;



CREATE VIEW view_chat_history AS
SELECT
  c_m.appuser_id,
  c_m.chat_message_id,
  c_m.broadcast_id,
  c_m.created_at,
  c_m.message,
  -- if the message doesn't have likes, Postgres returns '[null]' after join. 
  -- To fix this and return just an empty array, we use 'array_remove'
  array_remove(array_agg(c_m_l.appuser_id), NULL) AS liked_by_user_id
FROM chat_message_like AS c_m_l
  RIGHT OUTER JOIN 
    chat_message AS c_m 
  ON
    c_m.chat_message_id = c_m_l.chat_message_id
  GROUP BY 
    c_m.appuser_id,
    c_m.chat_message_id,
    c_m.broadcast_id,
    c_m.created_at,
    c_m.message;



CREATE VIEW view_chat_message_likes AS
SELECT 
  c_m.chat_message_id,
  array_remove(array_agg(c_m_l.appuser_id), NULL) AS liked_by_user_id
FROM chat_message_like AS c_m_l
  FULL OUTER JOIN 
    chat_message AS c_m
  ON
    c_m.chat_message_id = c_m_l.chat_message_id
GROUP BY
  c_m.chat_message_id;



-- Down Migration

DROP VIEW 
  view_chat_message_likes, 
  view_chat_history, 
  view_role_permissions, 
  view_broadcast;

DROP TABLE 
  broadcast_like,
  chat_message_like,
  chat_message,
  broadcast,
  appuser,
  role_resource_permission,
  permission,
  resource,
  role
  CASCADE;


