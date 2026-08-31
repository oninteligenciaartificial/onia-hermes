import { describe, expect, it } from "vitest";

import { rolDePerfilAutorizado } from "./onia-center-perfil";

// El middleware elegia el perfil con
//   profiles.find((item) => item.status === "active") ?? profiles[0]
// y la consulta NO filtraba por status. Un perfil dado de baja caia en ese
// `?? profiles[0]`, devolvia su rol, y como normalizeRoleKey hace `role ?? ""`
// el rol salia truthy y el guard `if (!role)` lo dejaba pasar.
//
// O sea: dar de baja una cuenta en la base NO cerraba la puerta. Y del otro
// lado, onia-center-auth.ts:252 SI filtraba por status=eq.active — dos caminos
// para lo mismo y solo uno cerrado.

describe("rolDePerfilAutorizado: solo una cuenta ACTIVA abre la puerta", () => {
  it("una cuenta dada de baja NO devuelve rol, aunque sea el unico perfil", () => {
    expect(rolDePerfilAutorizado([{ primary_role_key: "seller", status: "blocked" }])).toBe("");
  });

  it("tampoco entra si esta invitada pero todavia no activa", () => {
    expect(rolDePerfilAutorizado([{ primary_role_key: "sergio", status: "invited" }])).toBe("");
  });

  it("una cuenta activa si devuelve su rol", () => {
    expect(rolDePerfilAutorizado([{ primary_role_key: "sergio", status: "active" }])).toBe("sergio");
  });

  it("con varias, elige la activa y no la primera", () => {
    const rol = rolDePerfilAutorizado([
      { primary_role_key: "seller", status: "blocked" },
      { primary_role_key: "sergio", status: "active" },
    ]);
    expect(rol).toBe("sergio");
  });

  it("sin status no se asume activo (fail-closed: un dato viejo no abre la puerta)", () => {
    expect(rolDePerfilAutorizado([{ primary_role_key: "sergio" }])).toBe("");
  });

  it("lista vacia devuelve cadena vacia, que es lo que el guard `if (!role)` espera", () => {
    expect(rolDePerfilAutorizado([])).toBe("");
  });

  it("sigue traduciendo area_responsible a area (no se pierde al mover la logica)", () => {
    expect(rolDePerfilAutorizado([{ primary_role_key: "area_responsible", status: "active" }])).toBe(
      "area",
    );
  });
});
