---
title: "RAG ou grafo de conhecimento? Depende do modelo, e isso muda a pergunta"
description: "Comparei RAG e grafo de conhecimento em 2.160 respostas, com três famílias de modelo. O vencedor muda conforme o modelo gerador, e essa é a variável que mais pesa."
tags: [ia, rag, grafos-de-conhecimento, avaliacao-de-llm, arquitetura]
image: /assets/img/posts/rag-vs-grafo-og.png
---

![Documento fatiado à esquerda, grafo de conhecimento à direita: as duas estratégias comparadas no experimento](/assets/img/posts/rag-vs-grafo-capa.png)

*Publicado originalmente no [LinkedIn](https://www.linkedin.com/pulse/rag-ou-grafo-de-conhecimento-depende-do-modelo-e-isso-aur%C3%A9lio-saraiva-iyo3f/) e no [Medium](https://medium.com/@aureliosaraiva/rag-ou-grafo-de-conhecimento-medi-em-2-160-respostas-e-a-resposta-%C3%A9-desconfort%C3%A1vel-a734ec298777) em 24/09/2026.*


Toda discussão sobre assistente técnico corporativo trava no mesmo ponto. Alguém
defende RAG, alguém defende grafo de conhecimento, e os dois lados têm argumentos
bons e nenhum número. Eu quis medir.

Montei um experimento controlado: dois enfoques, três famílias de modelo, três
repetições, 120 perguntas com gabarito. 2.160 respostas avaliadas por uma métrica
determinista e por um painel de três juízes.

**Minha tese, e ela é menos satisfatória do que eu queria:** não existe vencedor
absoluto, o sinal inverte conforme o modelo gerador, e a variável de maior efeito
não é nenhuma das duas estratégias: é qual modelo você usa por trás.

Se você só tem cinco minutos, o resumo é este:

- O grafo só venceu com significância estatística em **um** dos três modelos.
- O painel de juízes preferiu o RAG nos **três**.
- Trocar o modelo melhorou mais a qualidade do que trocar a estratégia.
- O dataset é sintético e o gabarito é meu. Isso limita o que você pode levar daqui.

## O que este experimento mede, e o que ele não mede

Começo pelos limites, porque é o que decide se o resto vale a sua leitura.

**Mede:** qual das duas estratégias de recuperação produz respostas mais corretas,
mais completas e mais rastreáveis sobre um ecossistema de microsserviços, com o
modelo gerador mantido constante dentro de cada comparação.

**Não mede:** utilidade prática com desenvolvedores reais, custo de manutenção ao
longo do tempo, qualidade percebida por quem conhece o domínio, nem desempenho
sobre documentação de verdade, com suas inconsistências e seus buracos.

**E não mede o teto do grafo.** A minha implementação é deliberadamente simples:
vizinhança de um salto, casamento difuso de entidade. Um grafo com consulta
multi-hop e agregação global responderia coisas que o meu não responde. Parte da
desvantagem que você vai ver nas tabelas é da implementação, não do paradigma.

## O problema, que você provavelmente tem

Sua empresa migrou para microsserviços. Onde havia uma base de código que cabia
numa cabeça, agora há dezenas de serviços, contratos, eventos e bancos. O
conhecimento sobre isso existe, espalhado entre README, catálogo interno, board
de operação e três pessoas que sabem de cor.

As perguntas do dia a dia são banais e caras: *qual aplicação guarda dado
pessoal? quais são as dependências do serviço X? isso já existe, dá para
reusar?* Hoje a resposta é perguntar a alguém, ou ler documentação que pode estar
desatualizada. E o custo não é o tempo de busca, é a decisão técnica tomada
com informação velha.

Um assistente conversacional resolveria o acesso, desde que especializado no
domínio. E aí a literatura oferece dois caminhos.

**Não estruturado (RAG).** Fatia a documentação, indexa em base vetorial,
recupera os trechos mais similares à pergunta e injeta no prompt. O termo foi
introduzido por [Lewis et al. (2020)](https://arxiv.org/abs/2005.11401) e a
evolução recente está na [survey de Gao et al.](https://arxiv.org/abs/2312.10997).
Barato de manter, absorve mudança sem retreinar, fraco quando a resposta exige
raciocinar sobre relações explícitas.

**Estruturado (grafo de conhecimento).** Modela o ecossistema como nós e arestas
tipadas: serviço, time, evento, banco, dependência. Consulta determinista e
rastreável, cara de modelar e de governar. A referência de base é [Hogan et al.,
Knowledge Graphs](https://doi.org/10.1145/3447772).

A convergência dos dois é o [GraphRAG](https://arxiv.org/abs/2404.16130), e é
para onde o resultado deste experimento aponta.

## A regra que torna a comparação válida

A decisão mais importante veio antes de qualquer código: **só a camada de
conhecimento pode variar.**

| Elemento | Papel |
|---|---|
| Modelo, temperatura, prompts, contrato de resposta, avaliação | **Constante** |
| Camada de conhecimento e recuperação (documento × grafo) | **Variável — o objeto de estudo** |

![Diagrama do método: uma pergunta do banco segue por dois caminhos, RAG e grafo, gera duas respostas com o mesmo modelo, temperatura e prompt, e as duas passam pelos dois níveis de avaliação. 18 execuções, 2.160 respostas, 6.480 julgamentos.](/assets/img/posts/rag-vs-grafo-fluxo.png)

Sem esse princípio você compara duas implementações, não duas estratégias.
Qualquer diferença de prompt ou de formato de saída contamina o resultado de um
jeito que não dá para separar depois. É assim que quase todo benchmark
informal de RAG que circula por aí mede a habilidade de quem escreveu o prompt.

Os dois enfoques devolvem **exatamente o mesmo contrato de resposta**: pergunta,
enfoque, resposta, fontes, contexto recuperado, latência, custo estimado. É isso
que permite o código de avaliação, a API e a interface serem agnósticos.

## O domínio é sintético, e isso foi escolha

Precisava de um ecossistema realista, publicável e reproduzível. Usar o da
empresa onde trabalho estava fora de questão. Então construí o CredityFlow, uma
fintech de crédito com garantia que não existe:

| Ativo | Quantidade |
|---|---|
| Microsserviços | 52 |
| Eventos de domínio | 64 |
| Bancos de dados | 41 |
| Domínios / Times / Parceiros / Produtos | 15 / 15 / 8 / 6 |
| Nós do grafo / arestas | 201 / 669 |
| Documentos (lado não estruturado) | 117 |
| Perguntas do banco de avaliação | 120 |

Ser sintético compra três coisas: eu controlo o conteúdo, sei qual é a resposta
certa de cada pergunta, e qualquer pessoa pode reexecutar sem depender de sistema
interno nenhum. E paga com validade externa, que é a limitação principal deste
trabalho e está declarada no fim.

**O mesmo conhecimento existe nas duas representações**, com equivalência
garantida por regras de validação que rodam em integração contínua: se houver
referência quebrada, o dataset não é válido. Sem isso você acaba comparando um
lado que sabe mais que o outro, e nem percebe.

As 120 perguntas são rotuladas por categoria (factual, explicativa, impacto,
relacional, descoberta, ambígua), por dificuldade e por tipo de conhecimento,
cada uma com resposta esperada e fontes.

## Os parâmetros dos dois lados

**RAG:** fragmentos de 512 tokens, sobreposição de 50, top-k 5, embeddings
[BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5) rodando
local, [Qdrant](https://qdrant.tech) como base vetorial. A recuperação densa
segue o esquema popularizado por [Karpukhin et al.
(DPR)](https://arxiv.org/abs/2004.04906); a linhagem dos embeddings de sentença
vem de [Sentence-BERT](https://arxiv.org/abs/1908.10084) e a família BGE está
descrita em [C-Pack](https://arxiv.org/abs/2309.07597).

**Grafo:** [NetworkX](https://networkx.org) em memória, construído a partir dos
arquivos de origem, então sempre consistente com o dado. Casamento difuso de
entidade com limiar 70/100, vizinhança de um salto.

## A avaliação tem dois níveis porque um só mente

**Nível 1, heurístico.** Similaridade léxica, presença de entidades-chave,
cobertura de fontes. Barato, determinista, reproduzível. E superficial: penaliza
paráfrase, que é o defeito conhecido das métricas de sobreposição de n-gramas e a
razão de existirem alternativas semânticas como o
[BERTScore](https://arxiv.org/abs/1904.09675).

**Nível 2, painel de três juízes LLM**, um de cada família, avaliando
correctness, completeness, groundedness e clarity de 0 a 3. O paradigma de
LLM-as-a-judge foi consolidado por [Zheng et al.
(MT-Bench)](https://arxiv.org/abs/2306.05685).

O detalhe que importa: **a métrica de cabeceira é cross-family.** Para cada
resposta, o juiz da mesma família do gerador é excluído do cálculo. Modelo
reconhece o próprio texto e o avalia melhor. [Panickssery et al.
(2024)](https://arxiv.org/abs/2404.13076) mostram que a autopreferência está
ligada a essa capacidade de auto-reconhecimento. A única forma de neutralizar
isso é estruturalmente, nunca pedindo imparcialidade no prompt.

Significância por **teste de McNemar pareado**: as duas estratégias respondem
às mesmas perguntas, então o teste tem de ser pareado. Intervalos por bootstrap com
5.000 reamostragens, concordância entre juízes por kappa de Cohen.

## O placar, e a inversão que ele esconde

Taxa de acerto estrita, só acerto pleno conta, n = 360 por célula:

| Gerador | Estruturado | RAG | McNemar p |
|---|---|---|---|
| claude-sonnet-4-6 | 0,200 | 0,225 | 0,380 |
| gpt-5.5 | 0,361 | 0,417 | 0,103 |
| grok-build-0.1 | **0,411** | 0,294 | **< 0,001** |

Duas leituras, e as duas importam.

A primeira: **o sinal inverte conforme o modelo.** O RAG vence com dois
geradores, o grafo vence com o terceiro, e só essa última diferença é
significativa. Se eu tivesse rodado o experimento com um modelo só, como faz
quase todo benchmark que a gente lê, teria publicado uma conclusão confiante e
errada, com intervalo de confiança e tudo. Nada no resultado apontaria para isso.

A segunda: **a distância entre modelos é maior que a distância entre enfoques.**
Ir do claude-sonnet-4-6 para o gpt-5.5 melhora mais do que trocar de estratégia
dentro de qualquer um deles. Isso rebaixa "RAG ou grafo?" a uma decisão de segunda ordem, e
é o achado transversal do trabalho.

## Mude a definição de sucesso e o sinal muda de novo

Repeti o teste com a definição ampla: acerto mais parcial, penalizando só o
erro rotundo. O resultado se inverte: o RAG passa a vencer com significância nos dois
primeiros modelos, e a vantagem do grafo no terceiro deixa de ser significativa.

A leitura é precisa: **a virtude do RAG não é acertar mais. É errar menos feio.**

Quando a recuperação é parcial, ele responde incompleto. O grafo, quando o
casamento de entidade falha, responde errado com confiança. Para um assistente
interno essa distinção é tudo: resposta incompleta o desenvolvedor complementa,
resposta errada com fonte citada ele leva para a reunião.

## O painel discordou da métrica dura, e a discordância é o achado

| Célula | Média do painel (0–3) |
|---|---|
| Estruturado / claude-sonnet-4-6 | 2,13 |
| Estruturado / gpt-5.5 | 2,23 |
| Estruturado / grok-build-0.1 | 2,03 |
| RAG / claude-sonnet-4-6 | 2,30 |
| RAG / gpt-5.5 | **2,45** |
| RAG / grok-build-0.1 | 2,28 |

O painel prefere o RAG **nos três modelos**, incluindo aquele em que a heurística
dava vantagem estatisticamente significativa ao grafo.

Isso não é contradição, é instrumento. Um exemplo concreto: uma pergunta do banco
recebeu similaridade léxica de 0,25, foi classificada como **incorreta** pela
heurística e recebeu **2,88 de 3** do painel. A resposta estava certa, escrita com
outras palavras.

Métrica de n-grama mede vocabulário. Juiz LLM mede correção percebida, com viés.
Nenhuma das duas sozinha responde à pergunta, e quando elas discordam a
discordância aponta para onde olhar.

Uma honestidade sobre o painel: a concordância entre juízes foi apenas
**moderada**, kappa de Cohen entre 0,09 e 0,56. Painel de juízes LLM não é régua
de precisão. É segunda opinião estruturada, e frameworks como o
[RAGAS](https://arxiv.org/abs/2309.15217) existem justamente porque avaliar
geração aumentada por recuperação continua sendo problema aberto.

## Latência e custo

O RAG foi 12 a 20% mais rápido nos três modelos. Contexto de grafo é mais
compacto, mas a consulta tem uma etapa a mais.

Já o custo inverteu conforme o modelo: o grafo saiu mais barato com dois
geradores e mais caro com um. A composição de tokens de entrada e saída varia entre
provedores o suficiente para mudar o sinal, e eu reporto isso como observação, não
como conclusão: não fiz contrastação formal da composição de tokens.

## Como cada um falha

É a parte mais útil do trabalho, e a que não aparece em tabela nenhuma.

**O grafo falha estruturalmente.** Perguntei qual banco um serviço usa e ele
devolveu o identificador do nó, não o motor: o atributo não estava modelado. Em
"quantos times usam esta tecnologia?", a vizinhança de um salto recupera dois
serviços e ele responde com confiança sobre dois. E se o casamento difuso erra a
entidade, o contexto inteiro está errado sem que nada indique isso.

**O RAG falha por incompletude.** Identifica corretamente que um serviço usa
Redis, mas restringe a resposta ao serviço recuperado quando a pergunta pedia o
panorama.

Os dois erram, e erram coisas diferentes. **São defeitos complementares.** É
exatamente por isso que a direção óbvia é híbrida, com roteamento por tipo de
pergunta.

## O que eu faria na sua empresa

**Escolha o modelo primeiro.** É a variável de maior efeito. Tratar isso como
detalhe de implementação e passar semanas ajustando tamanho de fragmento é
otimizar o parâmetro de segunda ordem.

**Comece por RAG.** Piso melhor, manutenção mais barata, e o modo de falha é o
tolerável.

**Acrescente estrutura de forma cirúrgica:** dependência, ownership, consumo de
evento. Não tente modelar o ecossistema inteiro antes de entregar qualquer coisa.

**Não confie numa métrica só.** Uma heurística determinista e um painel de
famílias diferentes. Quando discordam, você achou um caso interessante, não um bug.

**Use teste pareado.** As duas estratégias respondem às mesmas perguntas.
Comparar médias sem McNemar produz confiança que o dado não sustenta.

## As limitações, ditas em voz alta

- **O dataset é sintético e o gabarito é meu.** Não houve validação com usuário
  real. Compra controle e reprodutibilidade, paga em validade externa.
- **A implementação do grafo é deliberadamente simples.** Parte da desvantagem em
  agregação pode ser minha, não do paradigma.
- **Utilidade prática e manutenibilidade não foram medidas.** Estavam nos
  objetivos e ficaram qualitativas.
- **A heurística não foi validada contra julgamento humano.** O painel mitiga,
  não resolve.
- 11 das 2.160 respostas (0,51%) foram erro de rede do provedor, não do sistema.

## Já sei o que vem no comentário

**"Em três meses esses modelos vão ser outros, e o seu placar não vale nada."**
Metade certa. O placar por célula envelhece, e é por isso que os nomes estão
escritos: para você saber exatamente o que expirou.

O que não envelhece é o resto. Se o sinal inverte conforme o gerador hoje, ele
inverte com a próxima geração também, e a conclusão de qualquer benchmark de um
modelo só continua sendo sorte. A distância entre modelos ser maior que a
distância entre estratégias é uma afirmação sobre a ordem de grandeza das
variáveis, não sobre estas três versões.

**"O seu grafo era fraco."** Provavelmente. Vizinhança de um salto e casamento
difuso são o piso do paradigma, e eu digo isso na segunda seção. O que isso
muda: o grafo tem mais teto a explorar do que este texto mostra. O que isso não
muda: o gerador continua pesando mais que a camada de recuperação, e essa parte
não depende da qualidade do meu grafo.

## Conclusão: a pergunta estava mal colocada

Eu queria sair daqui com "use grafo" ou "use RAG". O que o experimento devolveu é
que nenhuma das duas respostas existe sem antes dizer *com qual modelo*, e que a
variável que eu tratava como pano de fundo era a que mais pesava.

Isso é menos satisfatório e mais útil.

E vale além deste caso: **benchmark com uma variável escondida não erra com
alarde, erra com intervalo de confiança.** Antes de decidir arquitetura com base
num número, pergunte o que o experimento manteve constante, e se aquilo devia
mesmo estar constante.

## Referências

Tudo que este artigo afirma sobre trabalho de terceiro está aqui, com link para a
fonte primária. Os identificadores vieram das referências do meu TFM.

**Recuperação aumentada por geração**

1. Lewis, P. et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. [arXiv:2005.11401](https://arxiv.org/abs/2005.11401)
2. Gao, Y. et al. (2023). *Retrieval-Augmented Generation for Large Language Models: A Survey*. [arXiv:2312.10997](https://arxiv.org/abs/2312.10997)
3. Karpukhin, V. et al. (2020). *Dense Passage Retrieval for Open-Domain Question Answering*. [arXiv:2004.04906](https://arxiv.org/abs/2004.04906)
4. Edge, D. et al. (2024). *From Local to Global: A Graph RAG Approach to Query-Focused Summarization*. [arXiv:2404.16130](https://arxiv.org/abs/2404.16130)

**Conhecimento estruturado**

5. Hogan, A. et al. (2021). *Knowledge Graphs*. ACM Computing Surveys 54(4). [doi:10.1145/3447772](https://doi.org/10.1145/3447772)

**Representação vetorial**

6. Reimers, N.; Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*. [arXiv:1908.10084](https://arxiv.org/abs/1908.10084)
7. Xiao, S. et al. (2023). *C-Pack: Packed Resources For General Chinese Embeddings*. [arXiv:2309.07597](https://arxiv.org/abs/2309.07597)
8. BAAI. *bge-small-en-v1.5*. [Hugging Face](https://huggingface.co/BAAI/bge-small-en-v1.5)

**Avaliação de geração**

9. Zheng, L. et al. (2023). *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*. [arXiv:2306.05685](https://arxiv.org/abs/2306.05685)
10. Panickssery, A. et al. (2024). *LLM Evaluators Recognize and Favor Their Own Generations*. [arXiv:2404.13076](https://arxiv.org/abs/2404.13076)
11. Zhang, T. et al. (2020). *BERTScore: Evaluating Text Generation with BERT*. [arXiv:1904.09675](https://arxiv.org/abs/1904.09675)
12. Es, S. et al. (2023). *RAGAS: Automated Evaluation of Retrieval Augmented Generation*. [arXiv:2309.15217](https://arxiv.org/abs/2309.15217)

**Método estatístico**

13. McNemar, Q. (1947). *Note on the sampling error of the difference between correlated proportions or percentages*. Psychometrika 12(2), 153–157. [doi:10.1007/BF02295996](https://doi.org/10.1007/BF02295996)
14. Cohen, J. (1960). *A Coefficient of Agreement for Nominal Scales*. Educational and Psychological Measurement 20(1), 37–46. [doi:10.1177/001316446002000104](https://doi.org/10.1177/001316446002000104)
15. Landis, J. R.; Koch, G. G. (1977). *The Measurement of Observer Agreement for Categorical Data*. Biometrics 33(1), 159–174. [doi:10.2307/2529310](https://doi.org/10.2307/2529310)
16. Efron, B. (1979). *Bootstrap Methods: Another Look at the Jackknife*. The Annals of Statistics 7(1), 1–26. [doi:10.1214/aos/1176344552](https://doi.org/10.1214/aos/1176344552)

**Ferramentas usadas no experimento**

17. [Qdrant](https://qdrant.tech) — base vetorial.
18. [NetworkX](https://networkx.org) — grafo em memória.

---

*Derivado do meu Trabajo Fin de Máster no Máster en Formación Permanente en
Inteligencia Artificial Aplicada da Universidad Europea de Madrid, orientado pelo
Dr. Jorge Moratalla Collado.*

