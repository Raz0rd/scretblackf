# Script para converter arquivo para UTF-8
$filePath = "app\recargajogo\page.tsx"

Write-Host "Corrigindo encoding do arquivo: $filePath" -ForegroundColor Yellow

# Ler o conteúdo como Latin1 (ISO-8859-1) que é o encoding errado comum
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::GetEncoding("ISO-8859-1"))

# Fazer TODAS as substituições de encoding errado
$replacements = @{
    'SeleÃ§Ã£o' = 'Seleção'
    'GrÃ¡tis' = 'Grátis'
    'IndisponÃ­vel' = 'Indisponível'
    'UsuÃ¡rio' = 'Usuário'
    'ConteÃºdo' = 'Conteúdo'
    'DÃŠ' = 'DÊ'
    'ForÃ§ar' = 'Forçar'
    'tÃ­tulo' = 'título'
    'hidrataÃ§Ã£o' = 'hidratação'
    'nÃ£o' = 'não'
    'atÃ©' = 'até'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Salvar com UTF-8 (sem BOM)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)

Write-Host "Arquivo convertido para UTF-8 com sucesso!" -ForegroundColor Green
Write-Host "Total de substituições: $($replacements.Count)" -ForegroundColor Cyan
