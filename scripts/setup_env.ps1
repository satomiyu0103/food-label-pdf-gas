# Windows PowerShell 用: プロジェクトルートで実行するセットアップスクリプト
# 実行例: .\scripts\setup_env.ps1

param(
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# スクリプトは repo/scripts 下に置かれる想定→ルートへ移動
Set-Location (Resolve-Path "$scriptDir\..").Path

if (-not (Test-Path pyproject.toml)) {
    Write-Error "pyproject.toml が見つかりません。プロジェクトルートで実行してください。"
    exit 1
}

Write-Host "Upgrading pip and installing uv..."
python -m pip install --upgrade pip
python -m pip install uv

Write-Host "Creating uv virtual environment..."
uv venv

Write-Host "Installing project in editable mode..."
uv pip install -e .

Write-Host "Done. If you added dependencies, commit uv.lock to version control."
