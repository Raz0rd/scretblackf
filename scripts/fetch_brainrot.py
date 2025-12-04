"""
Script para buscar TODAS as páginas de itens de Brainrot da API
com salvamento progressivo em Python usando httpx
"""

import httpx
import json
import time
from pathlib import Path
from datetime import datetime

# Configurações
API_BASE_URL = 'https://www.eldorado.gg/api/flexibleOffers'
GAME_ID = '259'  # Steal a Brainrot
CATEGORY = 'CustomItem'
PAGE_SIZE = 24
OUTPUT_DIR = Path(__file__).parent.parent / 'data'
PROGRESS_FILE = OUTPUT_DIR / 'brainrot-progress.json'
CONSOLIDATED_FILE = OUTPUT_DIR / 'brainrot-all-pages.json'
DELAY_BETWEEN_REQUESTS = 2  # 2 segundos entre requisições

# Criar diretório data se não existir
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Carregar progresso anterior se existir
progress = {
    'lastPage': 0,
    'totalPages': 0,
    'items': [],
    'errors': []
}

if PROGRESS_FILE.exists():
    try:
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            progress = json.load(f)
        print(f'📂 Progresso anterior encontrado! Última página: {progress["lastPage"]}')
    except Exception as err:
        print(f'⚠️  Erro ao ler progresso anterior: {err}')
        print('Iniciando do zero...')

def save_progress():
    """Salvar progresso"""
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)

def fetch_page(client, page_index):
    """Faz requisição GET para a API"""
    params = {
        'gameId': GAME_ID,
        'category': CATEGORY,
        'usePerGameScore': 'false',
        'pageIndex': page_index,
        'pageSize': PAGE_SIZE
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.eldorado.gg/',
        'Origin': 'https://www.eldorado.gg'
    }
    
    response = client.get(API_BASE_URL, params=params, headers=headers, timeout=30.0)
    
    if response.status_code == 403:
        print(f'   ⚠️  Status 403 Forbidden - API bloqueou a requisição')
        print(f'   📄 Response: {response.text[:200]}')
        return None
    
    if response.status_code != 200:
        print(f'   ⚠️  Status {response.status_code}: {response.text[:200]}')
        return None
    
    return response.json()

def fetch_all_pages():
    """Buscar todas as páginas"""
    print('🚀 Iniciando busca de todas as páginas...\n')
    
    # Criar cliente httpx com configurações
    with httpx.Client(follow_redirects=True) as client:
        try:
            # Se não temos o total de páginas, buscar a primeira página
            if progress['totalPages'] == 0:
                print('📥 Buscando primeira página para descobrir total...')
                first_page = fetch_page(client, 1)
                
                if first_page is None:
                    print('❌ Não foi possível buscar a primeira página. Verifique se a API está bloqueando.')
                    return
                
                progress['totalPages'] = first_page.get('totalPages', 0)
                progress['lastPage'] = 1
                
                if 'data' in first_page and isinstance(first_page['data'], list):
                    progress['items'].extend(first_page['data'])
                
                save_progress()
                
                print(f'✅ Primeira página carregada!')
                print(f'📊 Total de páginas disponíveis: {progress["totalPages"]}')
                print(f'📦 Total de registros: {first_page.get("totalRecords", 0)}')
                print(f'🎯 Páginas a buscar: {progress["totalPages"]}\n')
                
                time.sleep(DELAY_BETWEEN_REQUESTS)
            
            # Continuar de onde parou
            start_page = progress['lastPage'] + 1
            
            for page in range(start_page, progress['totalPages'] + 1):
                try:
                    print(f'📥 Buscando página {page}/{progress["totalPages"]}...')
                    
                    page_data = fetch_page(client, page)
                    
                    if page_data is None:
                        print(f'   ⚠️  Página {page} retornou erro, pulando...')
                        progress['errors'].append({
                            'page': page,
                            'error': 'Retornou None (403 ou outro erro)',
                            'timestamp': datetime.now().isoformat()
                        })
                        time.sleep(DELAY_BETWEEN_REQUESTS * 2)
                        continue
                    
                    if 'data' in page_data and isinstance(page_data['data'], list):
                        progress['items'].extend(page_data['data'])
                        progress['lastPage'] = page
                        
                        # Salvar progresso a cada 10 páginas
                        if page % 10 == 0:
                            save_progress()
                            print(f'   💾 Progresso salvo! Total de itens: {len(progress["items"])}')
                        else:
                            print(f'   ✅ {len(page_data["data"])} itens adicionados (Total: {len(progress["items"])})')
                    
                    # Delay entre requisições
                    time.sleep(DELAY_BETWEEN_REQUESTS)
                    
                except Exception as error:
                    print(f'   ❌ Erro na página {page}: {error}')
                    progress['errors'].append({
                        'page': page,
                        'error': str(error),
                        'timestamp': datetime.now().isoformat()
                    })
                    save_progress()
                    
                    # Se tiver muitos erros seguidos, parar
                    recent_errors = [
                        e for e in progress['errors']
                        if (datetime.now() - datetime.fromisoformat(e['timestamp'])).total_seconds() < 60
                    ]
                    
                    if len(recent_errors) >= 5:
                        print('\n❌ Muitos erros consecutivos. Parando o script.')
                        print('💾 Progresso salvo. Execute novamente para continuar.\n')
                        break
                    
                    # Aumentar delay após erro
                    time.sleep(DELAY_BETWEEN_REQUESTS * 2)
            
            # Salvar arquivo final consolidado
            print('\n💾 Salvando arquivo consolidado...')
            
            consolidated_data = {
                'metadata': {
                    'extractedAt': datetime.now().isoformat(),
                    'totalPages': progress['totalPages'],
                    'pagesCollected': progress['lastPage'],
                    'totalItems': len(progress['items']),
                    'errors': len(progress['errors'])
                },
                'items': progress['items']
            }
            
            with open(CONSOLIDATED_FILE, 'w', encoding='utf-8') as f:
                json.dump(consolidated_data, f, indent=2, ensure_ascii=False)
            
            save_progress()
            
            print('\n✨ Busca concluída!')
            print(f'📊 Resumo:')
            print(f'   • Páginas coletadas: {progress["lastPage"]} de {progress["totalPages"]}')
            print(f'   • Total de itens: {len(progress["items"])}')
            print(f'   • Erros: {len(progress["errors"])}')
            print(f'\n📁 Arquivos salvos:')
            print(f'   • Progresso: {PROGRESS_FILE}')
            print(f'   • Dados consolidados: {CONSOLIDATED_FILE}')
            
        except Exception as error:
            print(f'\n❌ Erro fatal: {error}')
            print('💾 Progresso salvo. Execute novamente para continuar.\n')
            save_progress()
            raise

if __name__ == '__main__':
    fetch_all_pages()
