# Script de Teste de Cloaking - Coopersam Gaming
# ================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTES DE CLOAKING E REDIRECIONAMENTO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Função para fazer requisição e mostrar resultado
function Test-Url {
    param(
        [string]$Url,
        [string]$Description,
        [string]$UserAgent = ""
    )
    
    Write-Host "=== $Description ===" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        if ($UserAgent) {
            Write-Host "User-Agent: $UserAgent" -ForegroundColor Gray
            $response = Invoke-WebRequest -Uri $Url -UserAgent $UserAgent -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method Head -MaximumRedirection 0 -ErrorAction SilentlyContinue
        }
        
        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        
        if ($response.Headers.Location) {
            Write-Host "Redirect para: $($response.Headers.Location)" -ForegroundColor Magenta
        }
        
    } catch {
        if ($_.Exception.Response.StatusCode) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            Write-Host "Status: $statusCode" -ForegroundColor $(if($statusCode -eq 200){"Green"}elseif($statusCode -ge 300 -and $statusCode -lt 400){"Yellow"}else{"Red"})
            
            if ($_.Exception.Response.Headers.Location) {
                Write-Host "Redirect para: $($_.Exception.Response.Headers.Location)" -ForegroundColor Magenta
            }
        } else {
            Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# 1. TESTE COM WWW
Test-Url -Url "https://www.verifiedbyffire.store" -Description "TESTE 1: WWW (deve redirecionar)"

# 2. TESTE SEM WWW
Test-Url -Url "https://verifiedbyffire.store" -Description "TESTE 2: Sem WWW (página principal)"

# 3. TESTE COM SLUG ALEATÓRIO
Test-Url -Url "https://verifiedbyffire.store/abc123xyz" -Description "TESTE 3: Slug Aleatório (cloaking)"

Test-Url -Url "https://verifiedbyffire.store/teste-random-slug" -Description "TESTE 4: Outro Slug Aleatório"

# 4. TESTE COM GOOGLE BOT
$googleBot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
Test-Url -Url "https://verifiedbyffire.store/qualquer-slug" -Description "TESTE 5: Google Bot + Slug Aleatório" -UserAgent $googleBot

# 5. TESTE COM GOOGLE ADS BOT
$adsBot = "AdsBot-Google (+http://www.google.com/adsbot.html)"
Test-Url -Url "https://verifiedbyffire.store/abc123" -Description "TESTE 6: Google Ads Bot (IMPORTANTE)" -UserAgent $adsBot

# 6. TESTE COM FACEBOOK BOT
$facebookBot = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
Test-Url -Url "https://verifiedbyffire.store/teste123" -Description "TESTE 7: Facebook Bot" -UserAgent $facebookBot

# 7. TESTE COM USER-AGENT NORMAL
$normalUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
Test-Url -Url "https://verifiedbyffire.store/slug-invalido" -Description "TESTE 8: Usuário Normal + Slug Inválido" -UserAgent $normalUA

# 8. VERIFICAR CONTEÚDO DA PÁGINA
Write-Host "=== TESTE 9: Verificar Conteúdo HTML ===" -ForegroundColor Yellow
try {
    $content = Invoke-WebRequest -Uri "https://verifiedbyffire.store/teste-cloaking" -UseBasicParsing
    
    if ($content.Content -match "Coopersam Gaming") {
        Write-Host "✓ Página de Cupons detectada (Coopersam Gaming encontrado)" -ForegroundColor Green
    } elseif ($content.Content -match "checkout|pagamento|qr.?code") {
        Write-Host "✗ Página de Checkout detectada (não deveria aparecer)" -ForegroundColor Red
    } else {
        Write-Host "? Conteúdo não identificado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erro ao verificar conteúdo: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "COMPORTAMENTO ESPERADO:" -ForegroundColor White
Write-Host "✓ WWW deve redirecionar para sem WWW" -ForegroundColor Gray
Write-Host "✓ Slug aleatório deve mostrar página de cupons (200)" -ForegroundColor Gray
Write-Host "✓ Bots (Google, Facebook) devem ver página de cupons" -ForegroundColor Gray
Write-Host "✓ Usuários normais com slug inválido veem cupons" -ForegroundColor Gray
Write-Host "✓ Usuários normais com slug válido veem checkout" -ForegroundColor Gray
Write-Host ""
Write-Host "GOOGLE ADS VAI VER:" -ForegroundColor Yellow
Write-Host "→ Sempre a página institucional de cupons" -ForegroundColor Gray
Write-Host "→ Conteúdo seguro e aprovado" -ForegroundColor Gray
Write-Host "→ Sem menção a pagamentos" -ForegroundColor Gray
Write-Host ""

# INSTRUÇÕES PARA TESTAR COM SLUG CORRETO
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PRÓXIMO PASSO: TESTAR COM SLUG REAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para testar com um slug de produto real:" -ForegroundColor White
Write-Host "1. Pegue um slug válido do seu sistema" -ForegroundColor Gray
Write-Host "2. Execute:" -ForegroundColor Gray
Write-Host '   Test-Url -Url "https://verifiedbyffire.store/SEU-SLUG-AQUI" -Description "Slug Válido"' -ForegroundColor Cyan
Write-Host ""
Write-Host "Exemplo:" -ForegroundColor White
Write-Host '   Test-Url -Url "https://verifiedbyffire.store/diamantes-100" -Description "Produto Real"' -ForegroundColor Cyan
Write-Host ""
