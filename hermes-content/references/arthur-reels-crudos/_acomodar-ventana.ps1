# Acomoda la ventana de Claude en la posicion exacta que espera el grabador.
# Lo llama GRABAR-PANTALLA.bat antes de cada captura, asi el encuadre nunca se desacomoda
# aunque Arthur haya movido o maximizado la ventana entre clip y clip.
$sig = @'
using System;
using System.Runtime.InteropServices;
public class WinPos {
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int t, bool r);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
}
'@
Add-Type -TypeDefinition $sig -ErrorAction SilentlyContinue

$p = Get-Process claude -ErrorAction SilentlyContinue |
     Where-Object { $_.MainWindowTitle -eq "Claude" } |
     Select-Object -First 1

if (-not $p) {
  Write-Host "  AVISO: no encuentro la ventana de Claude. Abrila antes de grabar."
  exit 1
}

[WinPos]::ShowWindow($p.MainWindowHandle, 9) | Out-Null   # 9 = restaurar (des-maximizar)
Start-Sleep -Milliseconds 400
[WinPos]::MoveWindow($p.MainWindowHandle, 200, 20, 1320, 1000, $true) | Out-Null
[WinPos]::SetForegroundWindow($p.MainWindowHandle) | Out-Null
Start-Sleep -Milliseconds 600
Write-Host "  Ventana acomodada."
exit 0
