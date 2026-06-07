param(
  [string]$MediaRoot = "hermes-content/references/sergio-approved-media"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path $MediaRoot
$inbox = Join-Path $root "inbox"
$processed = Join-Path $root "processed"
$voiceInbox = Join-Path $root "voice-inbox"

New-Item -ItemType Directory -Force -Path $processed | Out-Null
New-Item -ItemType Directory -Force -Path $voiceInbox | Out-Null

$ffmpeg = "ffmpeg"
$ffprobe = "ffprobe"

$mediaFiles = Get-ChildItem -Path $inbox -File |
  Where-Object { $_.Extension -match '^\.(mov|mp4|m4v|heic|jpg|jpeg|png)$' }

foreach ($file in $mediaFiles) {
  $assetName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
  $assetDir = Join-Path $processed $assetName
  New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

  $metadataPath = Join-Path $assetDir "metadata.ffprobe.json"
  & $ffprobe -v error -show_entries format=format_name,duration,size:stream=index,codec_name,codec_type,width,height,pix_fmt -of json $file.FullName |
    Out-File -FilePath $metadataPath -Encoding utf8

  if ($file.Extension -match '^\.(heic|jpg|jpeg|png)$') {
    $previewPath = Join-Path $assetDir "$assetName`_preview.jpg"
    & $ffmpeg -hide_banner -loglevel error -y -i $file.FullName -frames:v 1 -update 1 -q:v 2 $previewPath | Out-Null
  }

  if ($file.Extension -match '^\.(mov|mp4|m4v)$') {
    $audioPath = Join-Path $voiceInbox "$assetName.wav"
    $framesDir = Join-Path $assetDir "frames"
    New-Item -ItemType Directory -Force -Path $framesDir | Out-Null

    & $ffmpeg -hide_banner -loglevel error -y -i $file.FullName -vn -ac 1 -ar 16000 $audioPath | Out-Null
    & $ffmpeg -hide_banner -loglevel error -y -i $file.FullName -vf "fps=1/3,scale=720:-1" (Join-Path $framesDir "frame_%03d.jpg") | Out-Null
  }
}

Write-Output "Processed $($mediaFiles.Count) media file(s) under $root"
