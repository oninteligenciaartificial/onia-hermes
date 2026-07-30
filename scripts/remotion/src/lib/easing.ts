import { Easing } from "remotion";

// Curvas de SALIDA exponenciales/polinómicas. Regla dura del brief: nada de
// bounce ni elastic — solo deceleración.
//
// EASE_OUT_EXPO usa la MISMA curva que --ease-out-expo en los tokens CSS de
// web-factory (rules/web/coding-style.md: cubic-bezier(0.16, 1, 0.3, 1)) para
// que la marca se sienta igual en web y en video.
export const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_OUT_QUART = Easing.bezier(0.25, 1, 0.5, 1);
export const EASE_OUT_QUINT = Easing.bezier(0.22, 1, 0.36, 1);
