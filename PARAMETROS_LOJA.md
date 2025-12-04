# Parâmetros da URL - Loja

## Parâmetros Disponíveis

### 1. `game` - Selecionar Jogo
Define qual jogo será exibido na loja.

**Valores aceitos:**
- `freefire` - Free Fire (padrão)
- `robux` ou `roblox` - Robux/Roblox
- `deltaforce` ou `delta` - Delta Force
- `haikyu` - HAIKYU!! FLY HIGH

**Exemplos:**
```
/loja?game=robux
/loja?game=freefire
/loja?game=deltaforce
/loja?game=haikyu
```

### 2. `item` - Pré-selecionar Item/Valor
Define qual valor de recarga será pré-selecionado.

**Valores aceitos:**
- Para Free Fire: `100`, `310`, `520`, `1.060`, `2.180`, `5.600`
- Para Robux: `1000`, `2000`, `5250`, `11000`, `24000`
- Para Delta Force: `60`, `300`, `680`, `1.280`, `3.280`, `6.480`
- Para Haikyu: `60`, `300`, `680`, `1.280`, `3.280`, `6.480`

**Exemplos:**
```
/loja?item=1000
/loja?game=robux&item=5250
/loja?game=freefire&item=2.180
```

## Combinações de Parâmetros

### Robux com valor pré-selecionado
```
/loja?game=robux&item=2000
```

### Free Fire com valor promocional
```
/loja?game=freefire&item=5.600
```

### Delta Force com valor específico
```
/loja?game=deltaforce&item=3.280
```

## Preservação de UTMs

Todos os parâmetros UTM existentes são preservados ao navegar entre jogos:
```
/loja?game=robux&utm_source=facebook&utm_campaign=black_friday
```

## Comportamento

1. **Sem parâmetros**: Carrega Free Fire por padrão
2. **Jogo inválido**: Ignora e mantém Free Fire
3. **Item inválido**: Ignora e não pré-seleciona nada
4. **Navegação interna**: Atualiza URL automaticamente ao trocar de jogo ou selecionar item
5. **Compartilhamento**: URLs podem ser compartilhadas com jogo e item pré-selecionados

## Notas Técnicas

- Parâmetros são case-insensitive para `game`
- A URL é atualizada via `history.replaceState` (não adiciona ao histórico)
- UTMs e outros parâmetros são preservados
- Detecção acontece no primeiro carregamento da página
