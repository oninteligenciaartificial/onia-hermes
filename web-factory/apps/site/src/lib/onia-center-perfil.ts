// Quien puede entrar al ONIA Center, aislado del middleware para poder testearlo:
// un middleware de Next hace fetch contra Supabase y no se puede ejercitar sin red.
// Esta es la decision de acceso, y es justo lo que hay que fijar con un test.
//
// EL BUG QUE CIERRA (2026-08-30). El middleware elegia el perfil asi:
//
//     profiles.find((item) => item.status === "active") ?? profiles[0]
//
// y la consulta a user_profiles NO filtraba por status. Un perfil dado de baja
// caia en ese `?? profiles[0]`, devolvia su rol, y como el normalizador hacia
// `role ?? ""` el rol salia truthy: el guard `if (!role)` lo dejaba pasar.
//
// O sea: dar de baja una cuenta en la base NO cerraba la puerta. Se descubrio
// yendo a verificar si bajar las cuentas de arthur y los dos vendedores
// realmente los sacaba — y no los sacaba.
//
// Del otro lado, lib/onia-center-auth.ts SI filtraba `status=eq.active`. Dos
// caminos para la misma decision y solo uno cerrado: el patron de arreglar la
// instancia y dejar viva la hermana.

export type OniaCenterProfile = {
  primary_role_key?: string | null;
  status?: string | null;
};

/** El unico status que abre la puerta. `invited` y `blocked` no entran. */
const STATUS_HABILITADO = "active";

/**
 * Rol efectivo del usuario, o cadena vacia si NINGUN perfil suyo esta activo.
 *
 * Devuelve `""` y no `null` a proposito: es lo que el guard `if (!role)` del
 * middleware ya esperaba, asi que el llamador no cambia de forma.
 *
 * Fail-closed: sin `status`, no se asume activo. Una fila vieja sin el campo no
 * puede abrir la puerta por omision.
 */
export function rolDePerfilAutorizado(profiles: OniaCenterProfile[]) {
  const activo = profiles.find((item) => item.status === STATUS_HABILITADO);
  if (!activo) return "";

  const role = activo.primary_role_key;
  if (role === "area_responsible") return "area";
  return role ?? "";
}
