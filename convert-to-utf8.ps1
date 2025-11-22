# Script para converter arquivo de Windows-1252 para UTF-8
$filePath = "app\recargajogo\page.tsx"

Write-Host "Convertendo $filePath de Windows-1252 para UTF-8..." -ForegroundColor Yellow

try {
    # Tentar ler como Windows-1252 (encoding padrão do Windows)
    $content = Get-Content $filePath -Raw -Encoding Default
    
    # Salvar como UTF-8 sem BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
    
    Write-Host "[OK] Arquivo convertido com sucesso para UTF-8!" -ForegroundColor Green
    Write-Host "Tamanho: $([System.IO.File]::ReadAllBytes($filePath).Length) bytes" -ForegroundColor Cyan
}
catch {
    Write-Host "[ERRO] Erro ao converter arquivo: $_" -ForegroundColor Red
}
