$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$node = "C:\Program Files\nodejs\node.exe"
$stdout = Join-Path $PSScriptRoot "live-server.log"
$stderr = Join-Path $PSScriptRoot "live-server.err.log"

& $node "live-server.js" *> $stdout 2> $stderr
