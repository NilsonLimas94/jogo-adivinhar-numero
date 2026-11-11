# Adivinhe o Número — Arcade Edition

Jogo web interativo de adivinhação numérica com estética **Arcade Cyber-Neon**, implementado em **Vanilla HTML5, CSS3 e JavaScript (ES6+)** sem dependências externas.

---

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Mecânicas e Regras de Negócio](#-mecânicas-e-regras-de-negócio)
4. [Decisões Técnicas e Arquiteturais (ADR)](#-decisões-técnicas-e-arquiteturais-adr)
5. [Design System & Tokens](#-design-system--tokens)
6. [Como Executar](#-como-executar)
7. [Guia de Manutenção e Evolução (Roadmap)](#-guia-de-manutenção-e-evolução-roadmap)

---

## Visão Geral

O objetivo do jogador é descobrir o **número secreto (entre 1 e 100)** oculto no cofre antes que suas **5 vidas** se esgotem. A cada tentativa, a interface fornece feedback visual imediato em múltiplas camadas:

- **Mascote Robô Reativo**: Atualiza o balão de diálogo informando se o número secreto é maior (`▲`) ou menor (`▼`) que o palpite.
- **Termômetro de Proximidade (Frio/Quente)**: Pino dinâmico que desliza sobre a escala de `1` a `100` e alerta **`QUENTE! 🔥`** quando a distância absoluta até o alvo é de no máximo 10 unidades (`|secreto - palpite| <= 10`).
- **Controles Táteis de Ajuste Rápido**: Botões `[-10]`, `[-1]`, `[+1]` e `[+10]` acoplados a um mostrador numérico editável com trava de limites (*clamping*).
- **Histórico de Palpites**: Geração dinâmica de pílulas (*chips*) codificadas por cor (azul para subir, vermelho para descer).
- **Progressão de Sessão**: Acúmulo de sequência de vitórias (**Combo/Streak**) e **Gemas** ao longo das partidas.

---

## Estrutura do Projeto

```text
jogo-adivinhar-numero/
├── index.html   # Marcação semântica e ícones SVG inline
├── style.css    # Design Tokens (:root), layout Flexbox/Grid e UI 3D
├── script.js    # Gerenciamento de estado, validações e DOM
└── README.md    # Documentação técnica principal
```

---

## Mecânicas e Regras de Negócio

| Regra | Comportamento Técnico |
| :--- | :--- |
| **Sorteio Inicial** | Inteiro pseudoaleatório no intervalo fechado $[1, 100]$ via `Math.floor(Math.random() * 100) + 1`. |
| **Trava de Entrada (*Clamping*)** | Qualquer entrada manual ou via botões rápidos passa por `Math.min(100, Math.max(1, valor))`, impedindo palpites fora dos limites. |
| **Cálculo de Temperatura** | Distância absoluta `Math.abs(secretNumber - guess)`. Se $\le 10 \rightarrow$ **Quente**; se $> 10 \rightarrow$ **Frio**. |
| **Consumo de Vidas** | A cada erro, `lives` é decrementado (`5 → 0`) e o coração correspondente no DOM perde a classe `.active`. |
| **Condição de Vitória** | `guess === secretNumber`: revela o cofre, incrementa `streak++`, adiciona `+50` em `gems` e bloqueia novos chutes (`gameOver = true`). |
| **Condição de Derrota** | `lives === 0`: zera o `streak`, revela o número oculto no cofre e bloqueia a partida até o reinício. |

---

## Decisões Técnicas e Arquiteturais (ADR)

### 1. Zero Dependências (Vanilla Stack)
O projeto não utiliza frameworks ou bibliotecas de terceiros. Toda a manipulação de estado e renderização ocorre via APIs nativas do DOM, garantindo carregamento instantâneo, zero *build step* e manutenção direta.

### 2. SVGs Vetoriais Inline & Entidades Tipográficas
Em vez de depender de emojis do sistema operacional (que sofrem variações gráficas entre Windows, macOS, Android e iOS ou falham na importação para o Figma), o projeto adota:
- **SVGs Inline (`<svg>`)** para ícones complexos (foguete, chama em duas camadas, diamante facetado e alto-falante).
- **HTML Entities (`&hearts;`, `&#8635;`)** para símbolos monocromáticos que herdam dinamicamente a propriedade `color` e `text-shadow` do CSS.

### 3. Escalabilidade de Controles via `data-*` Attributes
Os botões de ajuste rápido utilizam o atributo `data-step` (`-10`, `-1`, `1`, `+10`) no HTML. No JavaScript, um único iterador lê `Number(btn.dataset.step)` e aplica o deslocamento. Isso permite adicionar novos botões (ex.: `-5` ou `+5`) editando apenas o HTML.

### 4. Mapeamento 1:1 no Termômetro (`left: N%` + `translateX(-50%)`)
Como o intervalo do jogo é de `1` a `100`, o valor do palpite é injetado diretamente como percentual na propriedade CSS `left: ${clamped}%` do pino (`.thermo-pin`), enquanto `transform: translateX(-50%)` garante que o eixo central do pino aponte com precisão para a coordenada.

---

## Design System & Tokens

As variáveis globais declaradas em `:root` no [`style.css`](./style.css) centralizam toda a identidade visual do projeto:

| Token CSS | Hexadecimal | Aplicação |
| :--- | :--- | :--- |
| `--bg-dark` | `#0E0B25` | Fundo base do contêiner mobile |
| `--card-bg` | `#1C143F` | Superfície de pílulas, chips e botões secundários |
| `--border-purple` | `#3D3066` | Bordas estruturais de baixa ênfase |
| `--cyan` | `#06B6D4` | Ação primária (Botão 3D), visor do robô e gemas |
| `--purple` | `#A855F7` | Destaque do cartão principal e chassi do cofre |
| `--amber` | `#F59E0B` | Balão de dica do robô, pino do termômetro e nível |
| `--yellow` | `#FDE047` | Textos de destaque quente e ponto de interrogação `?` |
| `--pink` | `#F43F5E` | Indicadores de vida (corações ativos) |

---

## Como Executar

Por ser construído com tecnologias nativas da Web, não é necessária instalação de pacotes (`npm`/`node`):

1. Clone ou baixe este repositório.
2. Abra o arquivo [`index.html`](./index.html) diretamente em qualquer navegador moderno, ou utilize a extensão **Live Server** no VS Code.

---

## Guia de Manutenção e Evolução (Roadmap)

Os pontos abaixo já estão documentados via comentários `shortcut:` no código-fonte para facilitar futuras expansões:

1. **Persistência de Dados (`localStorage`)**:
   - *Estado atual*: `streak` e `gems` residem em memória RAM durante a sessão.
   - *Como evoluir*: Salvar `localStorage.setItem('arcade_gems', gems)` ao vencer e hidratar as variáveis na inicialização do [`script.js`](./script.js).
2. **Níveis de Dificuldade Dinâmicos**:
   - *Estado atual*: 5 elementos `.heart` estáticos no [`index.html`](./index.html) acoplados a `lives = 5` e limite `1–100`.
   - *Como evoluir*: Gerar os elementos `.heart` via loop no JS conforme a dificuldade escolhida e atualizar a fórmula da função `updatePin(value)` para `((clamped - min) / (max - min)) * 100`.
3. **Efeitos Sonoros (Web Audio API)**:
   - O botão `#btn-audio` no cabeçalho já está estruturado e pronto para receber um controlador de efeitos sonoros sintetizados ou arquivos `.mp3`.
