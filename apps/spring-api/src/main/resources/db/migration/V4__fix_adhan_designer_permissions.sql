-- Keep only the intended permissions for the designer role used by Adhan Designer
-- This persona should be both design-capable and dashboard-capable.
delete from role_permissions
where role_id = 'designer' and permission_id not in ('design:view', 'dashboard:view');

insert into role_permissions (role_id, permission_id)
values ('designer', 'dashboard:view')
on conflict (role_id, permission_id) do nothing;
