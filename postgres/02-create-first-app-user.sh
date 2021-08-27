#!/bin/bash

echo "Initializing database..."
echo "Create first app user and assign him role ('superadmin'), settings, resource permissions (grant all permissions)"

psql \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_USER" \
  -c "
    INSERT INTO 
      appuser (role_id, username, password_hash, email, is_confirmed, is_deleted) 
    VALUES 
			(1, '$SUPERADMIN_USERNAME', '$SUPERADMIN_PASSWORD', '$SUPERADMIN_EMAIL', true, false);


    INSERT INTO 
      appuser_setting (appuser_id, setting_id, allowed_setting_value_id, unconstrained_value)
    VALUES 
      (1, 1, 1, NULL); 


    INSERT INTO 
      role_resource_permission (role_id, resource_id, permission_id)
    VALUES 
      (1, 1, 1), (1, 1, 2), (1, 1, 3), (1, 1, 4), (1, 1, 5),
      (1, 2, 1), (1, 2, 2), (1, 2, 3), (1, 2, 4), (1, 2, 5),
      (1, 3, 1), (1, 3, 2), (1, 3, 3), (1, 3, 4), (1, 3, 5),
      (1, 4, 1), (1, 4, 2), (1, 4, 3), (1, 4, 4), (1, 4, 5),
      (1, 5, 1), (1, 5, 2), (1, 5, 3), (1, 5, 4), (1, 5, 5),
      (1, 6, 1), (1, 6, 2), (1, 6, 3), (1, 6, 4), (1, 6, 5)
			(1, 7, 1), (1, 7, 2), (1, 7, 3), (1, 7, 4), (1, 7, 5),
			(1, 8, 1), (1, 8, 2), (1, 8, 3), (1, 8, 4), (1, 8, 5),
			(1, 9, 1), (1, 9, 2), (1, 9, 3), (1, 9, 4), (1, 9, 5),
			(1, 10, 1), (1, 10, 2), (1, 10, 3), (1, 10, 4), (1, 10, 5),
			(1, 11, 1), (1, 11, 2), (1, 11, 3), (1, 11, 4), (1, 11, 5),
			(1, 12, 1), (1, 12, 2), (1, 12, 3), (1, 12, 4), (1, 12, 5),
			(1, 13, 1), (1, 13, 2), (1, 13, 3), (1, 13, 4), (1, 13, 5);
  "