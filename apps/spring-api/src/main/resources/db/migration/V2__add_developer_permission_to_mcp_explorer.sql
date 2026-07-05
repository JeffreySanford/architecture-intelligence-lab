insert into permissions (id, label) values
  ('developer:view', 'View developer-only lab pages')
on conflict (id) do nothing;

insert into role_permissions (role_id, permission_id) values
  ('mcp-explorer', 'developer:view')
on conflict (role_id, permission_id) do nothing;
