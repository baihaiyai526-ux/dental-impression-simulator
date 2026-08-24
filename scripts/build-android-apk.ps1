$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$jdkHome = Join-Path $projectRoot ".tooling\jdk21\jdk-21.0.12.1+1"
$androidHome = Join-Path $projectRoot ".tooling\android-sdk"
$localGradle = Join-Path $projectRoot ".tooling\gradle\gradle-8.14.3\bin\gradle.bat"
$gradleProject = Join-Path $projectRoot "android"
$localProperties = Join-Path $gradleProject "local.properties"
$sourceApk = Join-Path $gradleProject "app\build\outputs\apk\debug\app-debug.apk"
$artifactDirectory = Join-Path $projectRoot "artifacts"
$outputApk = Join-Path $artifactDirectory "dental-impression-training-debug.apk"

if (-not (Test-Path -LiteralPath (Join-Path $jdkHome "bin\java.exe"))) {
  throw "OpenJDK 21 was not found in $jdkHome"
}

if (-not (Test-Path -LiteralPath (Join-Path $androidHome "platforms\android-36"))) {
  throw "Android SDK API 36 was not found in $androidHome"
}

$env:JAVA_HOME = $jdkHome
$env:ANDROID_HOME = $androidHome
$env:ANDROID_SDK_ROOT = $androidHome
$sdkPropertyPath = $androidHome.Replace("\", "/")
Set-Content -LiteralPath $localProperties -Value "sdk.dir=$sdkPropertyPath" -Encoding ASCII

Push-Location $projectRoot
try {
  & npm.cmd run build:mobile
  if ($LASTEXITCODE -ne 0) { throw "Mobile web build failed." }

  & npx.cmd cap sync android
  if ($LASTEXITCODE -ne 0) { throw "Capacitor Android sync failed." }

  Push-Location $gradleProject
  try {
    $gradleCommand = if (Test-Path -LiteralPath $localGradle) { $localGradle } else { ".\gradlew.bat" }
    & $gradleCommand assembleDebug --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Android Gradle build failed." }
  } finally {
    Pop-Location
  }

  New-Item -ItemType Directory -Force -Path $artifactDirectory | Out-Null
  Copy-Item -LiteralPath $sourceApk -Destination $outputApk -Force
  $stream = [IO.File]::OpenRead($outputApk)
  try {
    $sha256 = [Security.Cryptography.SHA256]::Create()
    try {
      $hash = ([BitConverter]::ToString($sha256.ComputeHash($stream))).Replace("-", "").ToLowerInvariant()
    } finally {
      $sha256.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
  Write-Output "APK=$outputApk"
  Write-Output "SHA256=$hash"
} finally {
  Pop-Location
}
