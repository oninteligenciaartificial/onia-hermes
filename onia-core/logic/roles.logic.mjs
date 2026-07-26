/*
 * Logica pura canonica de permisos (core). Motor deny-by-default sobre
 * RoleAssignment: resuelve los permisos efectivos de un miembro segun sus roles
 * activos (no expirados), su alcance (organizacion o area/sucursal) y una matriz
 * de permisos { roleKey: [acciones] } que aporta el producto/vertical. El core NO
 * hardcodea la matriz de un rubro; provee el motor. Sin estado, sin IO.
 */

/** Asignaciones activas y no vencidas a `now`. */
export function activeRoleAssignments(assignments = [], { now = new Date().toISOString() } = {}) {
  const nowMs = new Date(now).getTime();
  return assignments.filter((assignment) => {
    if (assignment?.active === false) {
      return false;
    }
    return !assignment?.expiresAt || new Date(assignment.expiresAt).getTime() > nowMs;
  });
}

/** Una asignacion de organizacion aplica siempre; una de area solo en su alcance. */
function assignmentInScope(assignment, scope) {
  if (!assignment?.scopeType || assignment.scopeType === "ORGANIZATION") {
    return true;
  }
  if (!scope) {
    return false;
  }
  return assignment.scopeType === scope.type && assignment.scopeId === scope.id;
}

/** roleKeys efectivos (activos + en alcance). */
export function effectiveRoleKeys(assignments = [], { now, scope } = {}) {
  return activeRoleAssignments(assignments, { now })
    .filter((assignment) => assignmentInScope(assignment, scope))
    .map((assignment) => assignment.roleKey);
}

/** Union de acciones permitidas por todos los roles efectivos. */
export function resolvePermissions(assignments, matrix = {}, { now, scope } = {}) {
  const actions = new Set();
  for (const roleKey of effectiveRoleKeys(assignments, { now, scope })) {
    for (const action of matrix[roleKey] ?? []) {
      actions.add(action);
    }
  }
  return actions;
}

/** Deny-by-default: solo true si algun rol efectivo concede la accion (o '*'). */
export function can(assignments, action, matrix = {}, { now, scope } = {}) {
  const actions = resolvePermissions(assignments, matrix, { now, scope });
  return actions.has("*") || actions.has(action);
}
