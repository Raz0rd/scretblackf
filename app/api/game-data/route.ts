import { NextRequest, NextResponse } from 'next/server'

// Forçar rota dinâmica (não pode ser estática porque usa searchParams)
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const uid = searchParams.get('uid')
    
    if (!uid) {
      return NextResponse.json({ 
        success: false, 
        error: 'UID é obrigatório' 
      }, { status: 400 })
    }

    // Validar UID (apenas números)
    if (!/^\d+$/.test(uid)) {
      return NextResponse.json({ 
        success: false, 
        error: 'UID deve conter apenas números' 
      }, { status: 400 })
    }

    // URL e chave escondidas no servidor
    const API_URL = 'https://api.recargatop.sbs/api/data/br'
    const API_KEY = 'razord'
    
    // Fazer requisição para a API externa
    const response = await fetch(`${API_URL}?uid=${uid}&key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'RecargaJogo/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao consultar dados do jogador' 
      }, { status: response.status })
    }

    const data = await response.json()
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📥 [Game Data API] RESPOSTA DA API:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("UID solicitado:", uid)
    console.log("Status:", response.status)
    console.log("Response Body:", JSON.stringify(data, null, 2))
    
    // Destacar nickname se usuário estiver logado
    if (data.nickname) {
      console.log("\n🎮 \x1b[32m\x1b[1m[USUÁRIO LOGADO]\x1b[0m")
      console.log("   👤 Nickname: \x1b[36m\x1b[1m" + data.nickname + "\x1b[0m")
      if (data.level) {
        console.log("   📊 Level: \x1b[33m" + data.level + "\x1b[0m")
      }
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    // Se o nickname for "LOGADO", significa que a API está com instabilidade
    // Retornar mensagem especial para o usuário continuar com email
    if (data.nickname === 'LOGADO') {
      return NextResponse.json({ 
        success: true, 
        data: data,
        warning: 'instability',
        message: 'Devido ao grande volume de acessos, estamos com instabilidade na verificação. Você pode continuar garantindo o recebimento por email!'
      })
    }
    
    // Retornar apenas os dados necessários (filtrar se necessário)
    return NextResponse.json({ 
      success: true, 
      data: data 
    })

  } catch (error) {
    console.error('Erro na API game-data:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
