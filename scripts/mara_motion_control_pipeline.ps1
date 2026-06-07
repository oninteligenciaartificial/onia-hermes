param(
  [Parameter(Mandatory = $true)]
  [string]$ReferenceVideoPath,

  [string]$RunName = "",

  [string]$OutputRoot = "hermes-content/references/ai-ecommerce-model/video-ads/motion-control-runs",

  [string]$IdentityImage = "hermes-content/references/ai-ecommerce-model/video-ads/full-body-motion-control-v1/20260606-mara-full-body-apartment-still-v1.png",

  [ValidateSet("seedance_2_0", "cinematic_studio_video_v2")]
  [string]$Model = "seedance_2_0",

  [int]$Duration = 10,

  [int]$ReferenceSeconds = 12,

  [switch]$UploadReference,

  [switch]$Estimate,

  [switch]$Generate
)

$ErrorActionPreference = "Stop"

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

function Get-SafeName {
  param([string]$Value)
  return (($Value -replace '[^A-Za-z0-9._-]', '-') -replace '-+', '-').Trim('-')
}

function Convert-HiggsfieldOutput {
  param([string]$Text)

  $trimmed = $Text.Trim()
  if ($trimmed.StartsWith("{") -or $trimmed.StartsWith("[")) {
    return $trimmed | ConvertFrom-Json
  }

  if ($trimmed -match '^(?<credits>[0-9]+(\.[0-9]+)?)\s+credits?$') {
    return [PSCustomObject]@{
      credits = [double]$Matches.credits
      raw = $trimmed
    }
  }

  return [PSCustomObject]@{
    raw = $trimmed
  }
}

if (-not (Test-Path -LiteralPath $ReferenceVideoPath)) {
  throw "Reference video not found: $ReferenceVideoPath"
}

$root = Resolve-Path "."
$resolvedReference = Resolve-Path -LiteralPath $ReferenceVideoPath
$identityPath = Resolve-Path -LiteralPath (Join-Path $root $IdentityImage)

if ([string]::IsNullOrWhiteSpace($RunName)) {
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $RunName = "$timestamp-$(Get-SafeName ([System.IO.Path]::GetFileNameWithoutExtension($resolvedReference.Path)))"
} else {
  $RunName = Get-SafeName $RunName
}

$runDir = Join-Path (Join-Path $root $OutputRoot) $RunName
$framesDir = Join-Path $runDir "frames"
New-Item -ItemType Directory -Force -Path $runDir, $framesDir | Out-Null

$sourceCopy = Join-Path $runDir "reference-source.mp4"
$drivingClip = Join-Path $runDir "reference-driving-clip.mp4"
$metadataPath = Join-Path $runDir "reference-metadata.ffprobe.json"
$promptPath = Join-Path $runDir "higgsfield-motion-prompt.txt"
$manifestPath = Join-Path $runDir "run-manifest.json"
$commandsPath = Join-Path $runDir "commands.ps1"
$readmePath = Join-Path $runDir "README.md"

Copy-Item -LiteralPath $resolvedReference.Path -Destination $sourceCopy -Force

Invoke-External "ffprobe" @(
  "-v", "error",
  "-show_entries", "format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,avg_frame_rate,duration",
  "-of", "json",
  $sourceCopy
) | Out-File -LiteralPath $metadataPath -Encoding utf8

# Higgsfield CLI uploads are much more reliable with a short, light driving clip.
Invoke-External "ffmpeg" @(
  "-hide_banner", "-loglevel", "error", "-y",
  "-i", $sourceCopy,
  "-t", "$ReferenceSeconds",
  "-vf", "scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=24",
  "-an",
  "-c:v", "libx264",
  "-crf", "24",
  "-preset", "medium",
  "-movflags", "+faststart",
  $drivingClip
) | Out-Null

Invoke-External "ffmpeg" @(
  "-hide_banner", "-loglevel", "error", "-y",
  "-i", $drivingClip,
  "-vf", "fps=1,scale=360:-2",
  (Join-Path $framesDir "motion_%03d.jpg")
) | Out-Null

$prompt = @"
Use the uploaded reference video as a motion-control guide for timing, camera angle, posture, hand gestures, leaning rhythm, head turns, speaking energy and body language.
Replace the person with Mara Vale, the fictional adult red-haired AI model.
Preserve Mara's exact identity from the image reference: same fair freckled skin, copper-red wavy hair, green-hazel eyes, nose, lips, jawline, warm smile and healthy adult proportions.
Keep expressive hand gestures and close-camera social-native storytime energy from the reference, but make the scene a warm modern apartment: soft curtains, lamp, sofa, side table, plant, luxury UGC atmosphere.
Outfit must be brand-safe and premium: cream fitted ribbed top under a relaxed ivory linen shirt or modest cream blazer, no deep cleavage, no logos.
Natural human movement, realistic hands, expressive but not exaggerated, no robotic mouth, no identity drift, no different face, no text, no watermark.
"@

$prompt | Set-Content -LiteralPath $promptPath -Encoding ASCII

$uploadId = $null
$uploadUrl = $null
$costJson = $null
$jobJson = $null
$resultUrl = $null
$downloadedResult = $null
$visualClean = $null

if ($UploadReference -or $Estimate -or $Generate) {
  $uploadRaw = npx -y -p "@higgsfield/cli" higgsfield upload create $drivingClip --json --no-color
  $uploadText = $uploadRaw -join "`n"
  $uploadText | Set-Content -LiteralPath (Join-Path $runDir "upload-reference.json") -Encoding ASCII
  $upload = Convert-HiggsfieldOutput $uploadText
  $uploadId = $upload.id
  $uploadUrl = $upload.url
}

if ($Estimate -or $Generate) {
  if (-not $uploadId) {
    throw "Upload ID missing. Use -UploadReference, -Estimate or -Generate."
  }

  $costArgs = @(
    "higgsfield", "generate", "cost", $Model,
    "--prompt", $prompt,
    "--image", $identityPath.Path,
    "--video", $uploadId,
    "--aspect_ratio", "9:16",
    "--duration", "$Duration",
    "--json", "--no-color"
  )

  if ($Model -eq "seedance_2_0") {
    $costArgs += @("--resolution", "720p", "--mode", "std")
  } elseif ($Model -eq "cinematic_studio_video_v2") {
    $costArgs += @("--mode", "std", "--genre", "intimate")
  }

  $costRaw = & npx -y -p "@higgsfield/cli" @costArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Higgsfield cost failed with exit code $LASTEXITCODE"
  }
  $costText = $costRaw -join "`n"
  $costText | Set-Content -LiteralPath (Join-Path $runDir "cost-$Model.json") -Encoding ASCII
  $costJson = Convert-HiggsfieldOutput $costText
}

if ($Generate) {
  if (-not $uploadId) {
    throw "Upload ID missing. Use -Generate after upload."
  }

  $createArgs = @(
    "higgsfield", "generate", "create", $Model,
    "--prompt", $prompt,
    "--image", $identityPath.Path,
    "--video", $uploadId,
    "--aspect_ratio", "9:16",
    "--duration", "$Duration",
    "--wait", "--wait-timeout", "30m", "--wait-interval", "10s",
    "--json", "--no-color"
  )

  if ($Model -eq "seedance_2_0") {
    $createArgs += @("--resolution", "720p", "--mode", "std")
  } elseif ($Model -eq "cinematic_studio_video_v2") {
    $createArgs += @("--mode", "std", "--genre", "intimate")
  }

  $jobRaw = & npx -y -p "@higgsfield/cli" @createArgs
  if ($LASTEXITCODE -ne 0) {
    $jobRaw | Set-Content -LiteralPath (Join-Path $runDir "generate-error-$Model.txt") -Encoding utf8
    throw "Higgsfield generation failed with exit code $LASTEXITCODE"
  }
  $jobText = $jobRaw -join "`n"
  $jobText | Set-Content -LiteralPath (Join-Path $runDir "job-$Model.json") -Encoding ASCII
  $jobJson = Convert-HiggsfieldOutput $jobText

  $firstJob = @($jobJson)[0]
  $resultUrl = $firstJob.result_url
  if ($resultUrl) {
    $downloadedResult = Join-Path $runDir "mara-motion-$Model-final.mp4"
    Invoke-WebRequest -Uri $resultUrl -OutFile $downloadedResult
    $visualClean = Join-Path $runDir "mara-motion-$Model-visual-clean.mp4"
    Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", $downloadedResult, "-an", "-c:v", "copy", "-movflags", "+faststart", $visualClean) | Out-Null
    Invoke-External "ffmpeg" @("-hide_banner", "-loglevel", "error", "-y", "-i", $visualClean, "-vf", "fps=1,scale=360:-2", (Join-Path $framesDir "result_%03d.jpg")) | Out-Null
  }
}

@"
`$prompt = @'
$prompt
'@
`$identity = '$($identityPath.Path)'
`$video = '$drivingClip'

# Upload compressed reference
npx -y -p @higgsfield/cli higgsfield upload create "`$video" --json --no-color

# Cost example
npx -y -p @higgsfield/cli higgsfield generate cost $Model --prompt "`$prompt" --image "`$identity" --video "$uploadId" --aspect_ratio 9:16 --duration $Duration --json --no-color

# Generate example
npx -y -p @higgsfield/cli higgsfield generate create $Model --prompt "`$prompt" --image "`$identity" --video "$uploadId" --aspect_ratio 9:16 --duration $Duration --wait --wait-timeout 30m --wait-interval 10s --json --no-color
"@ | Set-Content -LiteralPath $commandsPath -Encoding ASCII

$manifest = [PSCustomObject]@{
  run_name = $RunName
  status = "internal_draft_not_published"
  model = $Model
  duration = $Duration
  reference_seconds = $ReferenceSeconds
  source_copy = $sourceCopy
  driving_clip = $drivingClip
  identity_image = $identityPath.Path
  metadata = $metadataPath
  prompt = $promptPath
  upload_id = $uploadId
  upload_url = $uploadUrl
  cost = $costJson
  result_url = $resultUrl
  downloaded_result = $downloadedResult
  visual_clean = $visualClean
  rights_note = "Use only local, owned, licensed, or explicitly authorized reference videos for exact motion control. Public TikTok URLs are structure-only unless rights are confirmed."
}

$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding utf8

@"
# Mara Motion Control Run

Status: internal draft, not published.

Reference source:
`$sourceCopy`

Compressed driving clip:
`$drivingClip`

Identity image:
`$($identityPath.Path)`

Model:
`$Model`

Prompt:
`$promptPath`

Frames:
`$framesDir`

Upload ID:
`$uploadId`

Result URL:
`$resultUrl`

Downloaded result:
`$downloadedResult`

Visual clean:
`$visualClean`

Rights rule:
Use only local, owned, licensed, or explicitly authorized reference videos for
exact motion control. Public TikTok links can be analyzed as structure-only
unless rights are confirmed.
"@ | Set-Content -LiteralPath $readmePath -Encoding ASCII

$manifest | ConvertTo-Json -Depth 8
