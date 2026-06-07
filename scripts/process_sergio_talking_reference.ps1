param(
  [Parameter(Mandatory = $true)]
  [string]$VideoPath,

  [string]$RunName = "",
  [string]$OutputRoot = "hermes-content/references/sergio-approved-media/talking-video-lock"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $VideoPath)) {
  throw "Video not found: $VideoPath"
}

$resolvedVideo = Resolve-Path -LiteralPath $VideoPath
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
if ([string]::IsNullOrWhiteSpace($RunName)) {
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($resolvedVideo.Path)
  $safeBase = ($baseName -replace '[^A-Za-z0-9._-]', '-').Trim('-')
  $RunName = "$timestamp-$safeBase"
}

$root = Resolve-Path "."
$outputRootPath = Join-Path $root $OutputRoot
$runDir = Join-Path $outputRootPath $RunName
$framesDir = Join-Path $runDir "frames"
$mouthDir = Join-Path $runDir "mouth-frames"
$audioDir = Join-Path $runDir "audio"

New-Item -ItemType Directory -Force -Path $framesDir, $mouthDir, $audioDir | Out-Null

$sourceCopy = Join-Path $runDir ("source" + [System.IO.Path]::GetExtension($resolvedVideo.Path).ToLowerInvariant())
$metadataPath = Join-Path $runDir "metadata.ffprobe.json"
$audioPath = Join-Path $audioDir "source-16khz-mono.wav"
$contactSheet = Join-Path $runDir "talking-reference-contact-sheet.jpg"
$mouthSheet = Join-Path $runDir "mouth-teeth-contact-sheet.jpg"
$readmePath = Join-Path $runDir "README.md"

function Invoke-External {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Command,

    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command failed with exit code $LASTEXITCODE"
  }
}

Copy-Item -LiteralPath $resolvedVideo.Path -Destination $sourceCopy -Force

Invoke-External "ffprobe" @(
  "-v", "error",
  "-show_entries", "format=format_name,duration,size:stream=index,codec_name,codec_type,width,height,avg_frame_rate,pix_fmt",
  "-of", "json",
  $sourceCopy
) | Out-File -LiteralPath $metadataPath -Encoding utf8

Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", $sourceCopy, "-vn", "-ac", "1", "-ar", "16000", $audioPath) | Out-Null

# General identity frames: enough to see face, hair, jaw, shoulders and lighting.
Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", $sourceCopy, "-vf", "fps=1,scale=1080:-2", (Join-Path $framesDir "frame_%03d.jpg")) | Out-Null

# Dense mouth frames: useful for teeth, lip shape and mouth-open QA.
Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", $sourceCopy, "-vf", "fps=2,scale=1080:-2", (Join-Path $mouthDir "mouth_%03d.jpg")) | Out-Null

$frameFiles = Get-ChildItem -LiteralPath $framesDir -Filter "frame_*.jpg" | Sort-Object Name
$mouthFiles = Get-ChildItem -LiteralPath $mouthDir -Filter "mouth_*.jpg" | Sort-Object Name

if ($frameFiles.Count -gt 0) {
  Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", (Join-Path $framesDir "frame_%03d.jpg"), "-vf", "scale=360:-2,tile=5x4", "-frames:v", "1", $contactSheet) | Out-Null
}

if ($mouthFiles.Count -gt 0) {
  Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", (Join-Path $mouthDir "mouth_%03d.jpg"), "-vf", "scale=300:-2,tile=6x5", "-frames:v", "1", $mouthSheet) | Out-Null
}

$runDirDisplay = $runDir -replace '\\', '/'
$sourceCopyDisplay = $sourceCopy -replace '\\', '/'
$audioPathDisplay = $audioPath -replace '\\', '/'
$contactSheetDisplay = $contactSheet -replace '\\', '/'
$mouthSheetDisplay = $mouthSheet -replace '\\', '/'

@"
# Sergio Talking Reference Lock

Status: internal source reference only. Not approved for publication.

Source video:
`$sourceCopyDisplay`

Extracted audio:
`$audioPathDisplay`

Contact sheets:
- General face/hair/body: `$contactSheetDisplay`
- Mouth/teeth dense frames: `$mouthSheetDisplay`

Frame counts:
- General frames: $($frameFiles.Count)
- Mouth frames: $($mouthFiles.Count)

Use this run as the source of truth for:
- real face proportions;
- real teeth alignment and mouth shape;
- jaw/neck movement;
- blink timing;
- natural speaking energy.

Do not publish generated face or voice outputs without explicit approval.
"@ | Set-Content -LiteralPath $readmePath -Encoding utf8

[PSCustomObject]@{
  run_name = $RunName
  run_dir = $runDir
  source_copy = $sourceCopy
  metadata = $metadataPath
  audio = $audioPath
  contact_sheet = $contactSheet
  mouth_sheet = $mouthSheet
  frames = $frameFiles.Count
  mouth_frames = $mouthFiles.Count
} | ConvertTo-Json -Depth 3
