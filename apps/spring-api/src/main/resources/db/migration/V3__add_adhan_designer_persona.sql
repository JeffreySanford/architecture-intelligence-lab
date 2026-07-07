insert into roles (id, label) values
  ('designer', 'Designer')
on conflict (id) do nothing;

insert into permissions (id, label) values
  ('design:view', 'View design-system labs')
on conflict (id) do nothing;

insert into role_permissions (role_id, permission_id) values
  ('designer', 'design:view'),
  ('designer', 'dashboard:view')
on conflict (role_id, permission_id) do nothing;

insert into users (id, display_name) values
  ('adhan-designer', 'Adhan Designer')
on conflict (id) do nothing;

insert into personas (id, user_id, role_id, display_name, description) values
  ('adhan-designer', 'adhan-designer', 'designer', 'Adhan Designer', 'Frontend design-system lab.')
on conflict (id) do nothing;

insert into user_roles (user_id, role_id)
  values ('adhan-designer', 'designer')
on conflict (user_id, role_id) do nothing;
