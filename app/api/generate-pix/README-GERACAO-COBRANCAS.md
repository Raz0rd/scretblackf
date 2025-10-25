# Sistema de Geração de Cobranças PIX

Este documento descreve como utilizar o sistema de geração de cobranças PIX com dados aleatórios para integração em outras lojas.

## Visão Geral

O sistema gera cobranças PIX utilizando dados aleatórios de:
- CPFs e nomes de pessoas reais
- Emails gerados automaticamente
- Telefones válidos brasileiros
- Endereços brasileiros variados

## Estrutura dos Arquivos

### 1. lista.txt
Contém os dados base no formato:
```
CPF:NOME_COMPLETO
```

Exemplo:
```
85399566672:AIDE MARIA DE JESUS
04486049497:MARTA MARIA SANTOS NASCIMENTO
```

### 2. addresses.txt
Contém endereços brasileiros no formato:
```
RUA, NÚMERO - COMPLEMENTO - BAIRRO, CIDADE/ESTADO - CEP: CEP_FORMATADO
```

Exemplo:
```
Rua Fábio Rangel Dinamarco, 93 - casa - Bosque dos Ipês, Guaratinguetá/SP - CEP: 12510516
Rua Frei Caneca, 376 - Casa - Centro, Campina Grande/PB - CEP: 58400295
```

## Scripts Disponíveis

### 1. gerar-cobrancas.js
Script principal que gera as cobranças com todos os dados aleatórios.

**Funcionalidades:**
- Lê os dados base do `registros-formatados.txt`
- Gera emails automaticamente com base nos nomes
- Cria telefones válidos brasileiros aleatórios
- Seleciona endereços aleatórios do `addresses.txt`
- Exporta o resultado para `cobrancas-qr-code.txt`

**Execução:**
```bash
node gerar-cobrancas.js
```

### 2. verificar-formato.js
Script para verificar o formato dos registros gerados.

**Execução:**
```bash
node verificar-formato.js
```

## Formato de Saída

O arquivo final `cobrancas-qr-code.txt` contém registros no formato:
```
CPF:EMAIL:NOME:TELEFONE:CEP|BAIRRO|Rua|CIDADE|ESTADO
```

Exemplo:
```
85399566672:aide.jesus_163@hotmail.com:AIDE MARIA DE JESUS:3122948914:13150148|Jardim Bela Vista|Rua Eurides de Godoi|Cosmópolis|SP
```

## Como Integrar em Outra Loja

### 1. Preparação
- Copie os arquivos `gerar-cobrancas.js`, `addresses.txt` e `registros-formatados.txt` para sua loja
- Certifique-se de ter o Node.js instalado

### 2. Geração de Dados
Execute o script para gerar novos registros:
```bash
node gerar-cobrancas.js
```

### 3. Leitura dos Dados
Para cada registro gerado, extraia as informações:
```javascript
const partes = registro.split(':');
const cpf = partes[0];
const email = partes[1];
const nome = partes[2];
const telefone = partes[3];
const enderecoParts = partes[4].split('|');
const [cep, bairro, rua, cidade, estado] = enderecoParts;
```

### 4. Integração com API de Pagamento
Utilize os dados extraídos para chamar a API de pagamento (exemplo com Umbrela):
```javascript
const payload = {
  amount: 1990, // Valor em centavos
  currency: "BRL",
  paymentMethod: "PIX",
  customer: {
    name: nome,
    email: email,
    document: {
      number: cpf,
      type: "CPF"
    },
    phone: telefone,
    address: {
      street: rua,
      streetNumber: "123",
      complement: "",
      zipCode: cep,
      neighborhood: bairro,
      city: cidade,
      state: estado,
      country: "br"
    }
  },
  // ... outros campos necessários
};
```

## Considerações Importantes

1. **Dados Fictícios**: Os CPFs e nomes são de pessoas reais, mas são usados apenas para testes e demonstrações
2. **Telefones Válidos**: Os telefones gerados seguem o padrão brasileiro (DDD + 8 ou 9 dígitos)
3. **Endereços Reais**: Os endereços são reais e válidos, distribuídos por várias regiões do Brasil
4. **Emails Gerados**: Os emails são criados automaticamente com o formato `nome.sobrenome_numero@hotmail.com`

## Customização

Você pode personalizar os dados modificando:
- `addresses.txt`: Adicione ou remova endereços conforme necessário
- `registros-formatados.txt`: Atualize a lista de CPFs e nomes
- `gerar-cobrancas.js`: Modifique as regras de geração de telefones ou emails

## Suporte

Para dúvidas ou problemas com a integração, verifique:
1. Se todos os arquivos necessários estão presentes
2. Se o Node.js está instalado corretamente
3. Se o formato dos arquivos de entrada está correto
