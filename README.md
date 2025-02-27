# LinkedIn Comment Generator

Uma extensão para Chrome/Edge que usa IA para gerar comentários no LinkedIn.

## Configuração

1. Clone este repositório:
```bash
git clone https://github.com/josesiqueira1/linkedin-ai-comments.git
cd linkedin-ai-comments
```

2. Instale as dependências:
```bash
npm install
```

3. Configure sua chave API:
   - Crie uma conta em [OpenRouter](https://openrouter.ai/)
   - Copie sua chave API do painel
   - Copie o arquivo de configuração exemplo:
     ```bash
     cp src/models/config.example.ts src/models/config.ts
     ```
   - Edite `src/models/config.ts` e substitua `YOUR-API-KEY-HERE` com sua chave API

4. Construa a extensão:
```bash
npm run build
```

5. Carregue a extensão:
   - Abra Chrome/Edge e vá para `chrome://extensions` ou `edge://extensions`
   - Ative o "Modo do desenvolvedor"
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `dist` do projeto

## Uso

1. Vá para qualquer post no LinkedIn
2. Clique no ícone da extensão na barra do navegador
3. Use os botões para gerar comentários ou respostas

## Modelos Disponíveis

Por padrão, a extensão usa o modelo `mistralai/mistral-7b-instruct`. Você pode mudar para outros modelos disponíveis no OpenRouter editando o arquivo `config.ts`.

Alguns modelos recomendados:
- `mistralai/mistral-7b-instruct` - Bom equilíbrio entre qualidade e velocidade
- `anthropic/claude-2` - Excelente qualidade, mas mais caro
- `google/gemini-pro` - Boa qualidade e preço moderado

## Segurança

⚠️ **IMPORTANTE**: 
- Nunca compartilhe sua chave API
- Não commite o arquivo `config.ts` com sua chave
- O arquivo `config.ts` está no `.gitignore` para evitar commits acidentais

## Contribuindo

Sinta-se à vontade para abrir issues ou enviar pull requests! 