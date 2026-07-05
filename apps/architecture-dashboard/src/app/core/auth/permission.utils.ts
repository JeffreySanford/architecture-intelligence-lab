export type PermissionRequirement =
  | string
  | string[]
  | { anyOf: string[] }
  | { allOf: string[] };

export function permissionRequirementMatches(
  hasPermission: (permission: string) => boolean,
  requirement: PermissionRequirement | undefined,
): boolean {
  if (!requirement) {
    return true;
  }

  if (typeof requirement === 'string') {
    return hasPermission(requirement);
  }

  if (Array.isArray(requirement)) {
    return requirement.some((permission) => hasPermission(permission));
  }

  if ('allOf' in requirement) {
    return requirement.allOf.every((permission) => hasPermission(permission));
  }

  if ('anyOf' in requirement) {
    return requirement.anyOf.some((permission) => hasPermission(permission));
  }

  return false;
}
