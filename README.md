# QA Editorial & Auditoria de Audiolivros

Aplicação web completa para **auditar, comparar e validar pares de arquivos PDF de livros**: o **PDF Original (edição impressa/canônica)** e o **PDF Revisado (roteiro adaptado para gravação de audiolivro)**.

Processamento **100% no navegador (Client-side)** via **PDF.js**, sem necessidade de backend ou envio de dados a servidores externos.

---

## Principais Funcionalidades

### 1. Upload e Extração Client-side de PDFs
- **Dual Dropzone**: Áreas de arrastar e soltar (Drag & Drop) ou seleção por clique para o PDF Original e o PDF Revisado.
- **Barra de Progresso Dinâmica**: Acompanhamento visual da extração página a página em tempo real com [PDF.js](https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js).
- **Amostras Prontas de Demonstração**: Exemplos literários reais (*O Beijo da Mulher-Aranha* de Manuel Puig e *A Mercadoria Mais Preciosa* de Jean-Claude Grumberg) para teste imediato.

### 2. Comparador de Texto & Engine de Discrepâncias (Git-Style Diff)
- Comparação semântica e textual entre as duas versões usando `diff_match_patch`.
- **Destaque Visual**:
  - <span style="color:#ef4444">**Vermelho (Removido)**</span>: Conteúdo da edição original omitido no audiolivro (falsa folha de rosto, ficha CIP, colofão tipográfico).
  - <span style="color:#22c55e">**Verde (Adicionado)**</span>: Conteúdo exclusivo do audiolivro (créditos Audible Studios, diretrizes para o narrador).
- **Alternância de Visualização**:
  - **Visão Unificada (Inline)**: Fluxo contínuo com tachados e inserções.
  - **Lado a Lado (Split View)**: Duas colunas sincronizadas (Original vs Revisado).
- **Validação de Sumário de Gravação**: Alerta crítico em banner quando um capítulo presente no miolo é omitido da listagem de gravação.

### 3. Detector e Mapeador de Notas de Rodapé
- Mapeamento estruturado de notas teóricas, explicações da tradução (`[N.T.]`) e notas da edição (`[N.E.]`).
- Tabela com capítulo, tema, intervalo comparativo de páginas `[Pág. Rev / Pág. Orig]` e integridade de texto.

### 4. Guia Fonético com Síntese de Voz Nativa (TTS)
- Rastreamento de vocábulos em línguas estrangeiras (alemão, francês, espanhol, inglês, etc.) no formato:
  `Palavra: [pronúncia-fonética-aproximada] — Pág. Revisado / Pág. Original`
- **Ouvir Pronúncia em Voz Alta**: Integração nativa com a Web Speech API (`window.speechSynthesis`) configurada para os idiomas correspondentes.
- **Gerenciador de Termos**: Adicionar novos termos, editar, filtrar e importar arquivos JSON gerados pelo script Python.

### 5. Auditoria Contextual do Termo "Livro" (Quebra de Mídia)
- Rastreia a palavra "livro" no roteiro para evitar que o narrador rompa a quarta parede em uma mídia sonora.
- Classificação automática em 3 categorias:
  - **Categoria A**: Citação do autor / Posfácio / Paratexto (Permitido).
  - **Categoria B**: Menção ficcional dentro da narrativa (Permitido - ex: personagem lendo um livro na prisão).
  - **Categoria C**: Quebra de mídia pelo narrador (Erro crítico - requer adaptação para "audiolivro" ou "ouvinte").

### 6. Gerador de Roteiro Revisado para Audiolivro (A partir do Miolo)
- **Cenário Sem Roteiro Pré-existente**: Para obras onde você dispõe **somente do Miolo impresso (Original)** — como em *As quintas que perdi* —, o sistema gera um PDF Revisado completo pronto para o estúdio:
  - **Eliminação de Páginas em Branco**: Supressão de páginas vazias e fólios sem conteúdo narrativo.
  - **Supressão Total de Notas de Rodapé**: Remoção automática de notas de tradução (`[N.T.]`), notas da edição (`[N.E.]`), notas do autor e chamadas numéricas.
  - **Injeção Inline de Pronúncias Fonéticas**: Conversão no próprio fluxo do texto sem interromper a narração (ex: `Stendhal [sten-DÁL]`).
  - **Extração Fonética Automática**: Escaneamento inteligente do PDF Original carregado com identificação de nomes próprios, termos estrangeiros e sugestão de pronúncias fonéticas.
  - **Fluxo Contínuo e Quebra Estrita por Capítulo**: Diagramação contínua de páginas sem cortes artificiais, quebrando páginas apenas ao término de capítulos ou preenchimento total da folha A4.
  - **Estrutura Padrão Audible Studios**:
    - **Página 1**: Folha de Rosto / Abertura oficial (`Audible Studios apresenta: {NOME DA OBRA} / Escrito por {AUTOR}`).
    - **Página 2**: **INFOS GERAIS** com 6 diretrizes essenciais para o narrador (*Ponto de vista*, *Gênero*, *Idioma*, *Local/cenário*, *Tom*, *Voz*).
    - **Página 3**: (OPENING TITLES) e início imediato da narração.
    - **Páginas 4+**: Corpo textual contínuo limpo, sem notas e com pronúncias inline na primeira ocorrência.
    - **Última Página**: (CLOSING TITLES) com créditos finais de produção.
  - **Exportação e Download**: Download direto do roteiro em **PDF formatado A4** (via `jsPDF`) ou em arquivo **TXT**, além da opção de enviar diretamente para o comparador de auditoria.

### 7. Painel de Métricas & Exportação
- **Cards Interativos de KPIs**: Clique direto nas métricas para navegar instantaneamente para a seção correspondente.
- **Exportação em Markdown (.md)**: Download de laudo técnico formatado para direção de estúdio.
- **Impressão / Salvar em PDF**: Folha timbrada formatada via `@media print`.

---

## Estrutura do Repositório

```text
├── index.html                             # Aplicação Single-Page completa pronta para execução
├── editorial_qa_auditor_comparador.html   # Ponto de entrada secundário independente
├── extrator_fonetico.py                   # Utilitário CLI para extração fonética e detecção de grafias
├── css/
│   └── style.css                          # Estilos de scrollbars, diff e impressão
├── js/
│   ├── app.js                             # Lógica de negócio, diffing, TTS e exportações
│   ├── presets.js                         # Dados e vocabulário fonético de demonstração
│   └── tailwind-config.js                 # Configurações do tema Tailwind
├── .gitignore
└── README.md
```

---

## Como Executar

Não é necessário instalar dependências ou rodar servidores complexos:

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiogafo/Qa-Audiobook.git
   cd Qa-Audiobook
   ```
2. Abra o arquivo `index.html` em qualquer navegador moderno (Google Chrome, Firefox, Safari ou Microsoft Edge).

---

## Privacidade e Segurança

Todo o processamento de PDFs e textos ocorre **100% no navegador do usuário (Client-side)** via Web Workers do PDF.js. Nenhum dado, texto ou arquivo é enviado para servidores externos.
