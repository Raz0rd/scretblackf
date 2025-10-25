# Gerador de Registros para QR Code

Este script gera registros no formato `CPF:email:Nome` com base nos dados do arquivo `lista.txt` para serem usados na geração de QR codes.

## Como usar

1. Certifique-se de ter o Node.js instalado em seu sistema
2. Execute o script com o comando:
   ```
   node formatar-final.js
   ```
3. O arquivo `registros-formatados.txt` será criado com os registros formatados

## Formato de saída

Cada linha do arquivo de saída terá o formato:
```
CPF:email.gerado@hotmail.com:Nome Completo
```

Este formato é compatível com o sistema de geração de QR codes do Umbrela.
