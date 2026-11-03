# Inteligência de Campanhas de Cancelamento

Sistema de análise, projeção e recomendação de campanhas de cancelamento para o **9º Tabelião de Protesto de Letras e Títulos da Capital de São Paulo**.

> **Status:** descoberta e preparação do MVP  
> **Estratégia:** começar com relatórios exportados do Charta e aprovação humana; evoluir gradualmente para integração controlada e automação.

## 1. Visão do projeto

O projeto pretende transformar os relatórios do Charta e os resultados das campanhas em uma base histórica capaz de responder, com evidências, perguntas como:

- quais tipos de títulos apresentam maior probabilidade de cancelamento;
- quais apresentantes, faixas de valor e idades de protesto convertem melhor;
- qual canal funciona melhor em cada segmento: telefone, e-mail, WhatsApp, DDA ou carta;
- qual vencimento e qual cadência de contato produzem melhor resultado;
- quantos cancelamentos e quanta receita uma campanha pode gerar;
- quais títulos devem ser priorizados diante da capacidade diária da equipe;
- quais campanhas geram resultado incremental e quais apenas coincidem com cancelamentos que ocorreriam naturalmente;
- como distribuir o trabalho para atingir metas sem repetir contatos ou gerar retrabalho.

O produto final deve funcionar como um **motor de inteligência para campanhas**, apoiando decisões operacionais e gerenciais sem substituir a conferência e a autorização dos responsáveis pela serventia.

## 2. Objetivos

### 2.1 Objetivo principal

Recomendar a melhor seleção de títulos, canais, vencimentos e ordem de prioridade para aumentar a quantidade de cancelamentos e a receita, com rastreabilidade e segurança operacional.

### 2.2 Objetivos específicos

1. Consolidar os relatórios exportados do Charta em uma base histórica única.
2. Relacionar cada título às campanhas das quais participou.
3. Identificar quais cancelamentos podem ser atribuídos a uma campanha.
4. Calcular conversão por campanha, canal, apresentante, período, faixa de valor e colaborador.
5. Criar um score explicável de probabilidade de cancelamento.
6. Projetar volume de cancelamentos, receita e carga operacional.
7. Recomendar público, canal, vencimento, cadência e tamanho da campanha.
8. Permitir testes A/B e comparação entre estratégias.
9. Manter trilha de auditoria das importações, regras, recomendações e aprovações.
10. Preparar uma futura integração controlada com o Charta.

## 3. Princípios do sistema

- **Aprovação humana:** no MVP, o sistema recomenda; o responsável decide e executa.
- **Explicabilidade:** cada recomendação deve informar os fatores que a justificam.
- **Rastreabilidade:** toda importação, transformação, regra e resultado deve ser auditável.
- **Regras versionadas:** parâmetros operacionais não devem ficar fixos no código.
- **Minimização de dados:** usar somente os dados pessoais necessários.
- **Sem dupla contagem:** um cancelamento não pode ser atribuído a mais de uma campanha sem regra explícita.
- **Correlação não é causalidade:** cancelamento posterior a uma campanha não significa automaticamente que a campanha o provocou.
- **Segurança por padrão:** começar com arquivos exportados; futura integração deverá ser inicialmente somente leitura.

## 4. Evidências iniciais disponíveis

### 4.1 Campanhas de novembro de 2026

As configurações apresentadas demonstram que o Charta permite campanhas com diferentes:

- períodos de autorização;
- datas de vencimento;
- ações, como DDA e e-mail;
- regras para descartar participantes após determinada data;
- opção de gerar apenas comunicado;
- tipos de pessoa, destinatário, envio e apresentante;
- limites e parâmetros de processamento.

Essas configurações deverão ser registradas como **metadados estruturados da campanha**. Prints podem servir como conferência, mas não devem ser a fonte principal do banco de dados.

### 4.2 Relatório de cancelamentos de outubro de 2026

O primeiro relatório analisado contém:

- período de 01/10/2026 a 30/10/2026;
- 290 páginas;
- 7.246 ocorrências em pedidos cancelados;
- 1 pedido indeferido;
- número e data do pedido;
- protocolo e data associada;
- número do processo;
- livro e folha;
- data do cancelamento;
- número do título;
- apresentante;
- devedor ou devedores.

Leitura exploratória preliminar, antes da normalização definitiva:

- aproximadamente 50% dos registros com data de protocolo identificada são de 2026;
- aproximadamente 22% são de 2025;
- aproximadamente 11% são de 2024;
- aproximadamente 6% são de 2023;
- aproximadamente 11% são de 2022 ou anos anteriores;
- o intervalo mediano entre a data associada ao protocolo e o cancelamento foi de aproximadamente 288 dias;
- o primeiro quartil foi de aproximadamente 69 dias;
- o terceiro quartil foi de aproximadamente 725 dias;
- PGE, PGFN, Município de São Paulo, Enel, Comgás e Sabesp concentram, em conjunto, aproximadamente 79% das ocorrências.

Esses valores são uma **linha de base exploratória**, não um resultado de campanha. Nomes de apresentantes aparecem com variações de acentuação e grafia e precisarão ser normalizados.

### 4.3 Primeiro CSV de participantes - campanha 2023

O primeiro CSV recebido foi relacionado à campanha com os seguintes parâmetros:

- autorizações de 01/01/2023 a 31/12/2023;
- ações DDA e cartas para cancelamento;
- vencimento em 16/11/2026;
- processamento de ações habilitado;
- processamento por protocolização desabilitado;
- pessoas físicas e jurídicas;
- envio para ambas as categorias de destinatário;
- todas as formas de envio;
- ordenação por CEP;
- conta bancária Parcela Express;
- inclusão de títulos suspensos com autorização de cancelamento;
- até 100 autorizações por devedor;
- parcelamento da campanha desabilitado.

Resumo técnico do arquivo:

- 18.213 linhas de origem;
- 15.829 protocolos únicos;
- 16.690 relações únicas entre protocolo e documento do devedor;
- 11 colunas;
- 11.878 linhas de CPF e 6.335 linhas de CNPJ;
- 201 grafias distintas de apresentante antes da normalização;
- 1.523 linhas integralmente repetidas;
- 813 protocolos aparecem em mais de uma linha;
- telefone, e-mail, origem do telefone e origem do e-mail estão vazios em 100% das linhas.

O campo `PROTOCOLO` já contém número e data no formato `numero - DD/MM/AAAA`, permitindo correspondência determinística com o relatório analítico de cancelamentos.

Foi identificado um padrão relevante de multiplicação de linhas em títulos com vários devedores. Há, por exemplo, protocolos com dois documentos exibidos em quatro linhas, três documentos exibidos em nove linhas e cinco documentos exibidos em 25 linhas. Esse comportamento sugere repetição combinatória na exportação e deverá ser tratado sem apagar o arquivo de origem.

Para análise, serão mantidos três níveis distintos:

1. **linha de origem**, preservada para auditoria;
2. **protocolo-devedor**, deduplicado por protocolo e documento;
3. **título/protocolo**, utilizado para cancelamento e projeção financeira.

Os valores de custas são consistentes dentro de cada protocolo. Considerando apenas um registro por protocolo, o potencial bruto listado soma aproximadamente **R$ 5,49 milhões**, com mediana de **R$ 116,76**, terceiro quartil de **R$ 250,53** e percentil 90 de **R$ 766,65**. Esse montante não representa receita projetada: ainda depende de elegibilidade, conversão, pagamento, cancelamento efetivo e eventual participação do mesmo protocolo em outras campanhas.

#### Alerta de pré-processamento

O cruzamento do CSV com o relatório de cancelamentos de outubro encontrou **339 protocolos**, equivalentes a **2,14% dos protocolos únicos da campanha**, que já constavam como cancelados antes da geração da campanha. Em todos os 339 casos, o apresentante também coincidiu após normalização.

Esse achado ainda não comprova que DDA, carta ou boleto tenham sido efetivamente enviados, pois o Charta pode aplicar uma nova validação durante o processamento das ações. Até que esse comportamento seja confirmado, o sistema deverá tratar esses registros como bloqueio de pré-processamento e gerar uma lista de conferência.

Riscos de manter títulos já cancelados na população da campanha:

- contato desnecessário com o usuário;
- emissão indevida ou inútil de comunicação e boleto;
- custo de carta e esforço operacional sem possibilidade de conversão;
- distorção da taxa de conversão e do potencial financeiro;
- risco reputacional por abordagem após a prática do cancelamento.

Controle proposto:

```text
antes de processar a campanha
    -> cruzar protocolo + data com cancelamentos já praticados
    -> bloquear correspondências exatas
    -> conferir conflitos de status
    -> liberar somente a população elegível
```

### 4.4 Dois modelos reais de campanha por carta

Foram recebidos dois lotes emitidos em 03/11/2026, ambos com vencimento em 30/11/2026. Cada destinatário ocupa duas páginas: uma página de comunicado com boleto e uma página destinada à entrega ou devolução.

| Indicador | Lote 01 - Correios | Lote 02 - Fast Express |
| --- | ---: | ---: |
| Páginas | 102 | 358 |
| Cartas/boletos | 51 | 179 |
| Títulos relacionados | 70 | 219 |
| Total de custas emitidas | R$ 107.926,26 | R$ 106.250,18 |
| Valor médio por boleto | R$ 2.116,20 | R$ 593,58 |
| Mediana por boleto | R$ 1.807,45 | R$ 530,54 |
| Menor boleto | R$ 827,63 | R$ 356,60 |
| Maior boleto | R$ 6.851,66 | R$ 4.636,79 |
| Cartas para CPF | 13 | 143 |
| Cartas para CNPJ | 38 | 36 |
| Cartas com um título | 42 | 148 |
| Máximo de títulos no mesmo boleto | 6 | 6 |
| Protocolo impresso | Sim | Não |
| Comprovante de entrega | Envelope/devolução dos Correios | AR com rastreio da Fast Express |

Consolidados, os dois lotes representam **230 cartas**, **289 títulos**, **228 devedores distintos** e **R$ 214.176,44** em custas emitidas. Não houve devedor repetido entre os dois lotes.

O Lote 01 tem perfil financeiro substancialmente mais alto: sua mediana por boleto é cerca de 3,4 vezes a mediana do Lote 02. Isso sugere que os lotes não devem ser comparados apenas pela quantidade de cartas; custo, conversão e retorno precisam ser medidos separadamente por modelo de entrega e segmento.

#### Conferência contra cancelamentos anteriores

- os 70 títulos do Lote 01 foram conferidos deterministicamente pelo número e pela data do protocolo;
- os 219 títulos do Lote 02 foram conferidos por número do título e nome normalizado do devedor, porque o protocolo não aparece no PDF;
- não foi encontrada correspondência com os cancelamentos do relatório de outubro em nenhum dos dois lotes.

O resultado do Lote 02 é uma verificação forte, mas ainda **inferencial**. Para auditoria definitiva, a geração de cada lote deverá produzir também um manifesto em CSV contendo protocolo, título, devedor pseudonimizado, boleto e lote.

#### Diferenças de conteúdo e taxonomia

Os textos dos dois comunicados não são equivalentes. O Lote 01 usa afirmações mais categóricas sobre o momento do cancelamento e a exclusão de cadastros; o Lote 02 explica que o vencimento não é prazo imposto e permite reemissão do boleto. Antes de automatizar a emissão, a serventia deverá aprovar um texto-base único, versionado e revisado, sem que o sistema altere seu conteúdo por conta própria.

O AR da Fast Express contém motivos chamados “endereço insuficiente”, embora essa classificação não exista no Well. O sistema deverá preservar o motivo original da transportadora e manter uma tabela separada de correspondência com as classificações internas, sem inventar um resultado no Well.

## 5. Limitação central: atribuição do cancelamento

O relatório de cancelamentos informa o resultado final, mas não informa sozinho:

- se o título participou de uma campanha;
- qual campanha gerou o contato;
- qual canal foi utilizado;
- quando o usuário recebeu a comunicação;
- se houve boleto de campanha;
- qual colaborador atuou;
- se o cancelamento ocorreria mesmo sem a campanha.

Por isso, o sistema deverá cruzar pelo menos três grupos de dados:

1. **participantes da campanha**;
2. **ações e boletos gerados**;
3. **cancelamentos realizados**.

Uma conversão somente será atribuída quando houver correspondência confiável entre o título da campanha e o título cancelado, dentro de uma janela de atribuição definida.

## 6. Fontes de dados

### 6.1 Relatório analítico de cancelamentos

Exportado mensalmente do Charta. Será a fonte principal para identificar os cancelamentos efetivamente praticados.

### 6.2 CSV de participantes de cada campanha

Para as campanhas de telefone e e-mail, cada CSV deverá ser enviado separadamente. Nas campanhas por carta, o PDF e o respectivo manifesto formarão a fonte principal. O CSV é a fonte preferencial para identificar:

- população selecionada;
- protocolo e título;
- data da campanha;
- canal planejado;
- ações processadas;
- eventual usuário ou colaborador;
- parâmetros de seleção disponíveis no arquivo.

No primeiro layout recebido, foram identificadas as seguintes colunas:

| Coluna | Uso no sistema | Tratamento |
| --- | --- | --- |
| `PROTOCOLO` | Chave do título, contendo número e data | Separar em `protocol_number` e `protocol_date` |
| `TIPO DE DOCUMENTO` | Classificação CPF/CNPJ | Converter em tipo de pessoa |
| `NÚMERO DE DOCUMENTO` | Identificação do devedor | Pseudonimizar antes da camada analítica |
| `NOME` | Conferência operacional | Restringir e não exibir em painéis agregados |
| `VALOR DE CUSTAS` | Potencial de receita | Contabilizar uma vez por protocolo |
| `VALOR DO TÍTULO` | Segmentação e análise | Contabilizar uma vez por protocolo |
| `TELEFONE` | Canal telefônico/WhatsApp | Pode estar vazio conforme a campanha |
| `EMAIL` | Canal de e-mail | Pode estar vazio conforme a campanha |
| `APRESENTANTE` | Segmentação principal | Normalizar por tabela de aliases |
| `ORIGEM EMAIL` | Qualidade e procedência do contato | Catálogo configurável |
| `ORIGEM TELEFONE` | Qualidade e procedência do contato | Catálogo configurável |

O importador não deve presumir que a presença de uma coluna significa disponibilidade do dado. A completude será calculada para cada arquivo e campanha.

### 6.3 Boletos das campanhas por carta

Cada arquivo ou lote deverá ser associado a uma campanha. Sempre que possível, deverá conter:

- identificador do boleto;
- protocolo ou identificador do título;
- data de emissão;
- vencimento;
- valor;
- lote da carta;
- situação de pagamento, quando disponível.

Se o boleto estiver apenas em PDF, será criado um processo de extração e conferência antes da importação.

Os dois layouts reais exigem importadores diferentes:

- **Lote 01 - Correios:** o protocolo completo está impresso e permite relacionamento determinístico;
- **Lote 02 - Fast Express:** o PDF contém número do título, apresentante, valores, devedor, código de autenticidade e rastreio, mas não mostra o protocolo;
- um boleto pode consolidar de um a seis títulos, portanto a relação entre boleto e título é de muitos para muitos e não pode ser modelada com um único `title_id` dentro do boleto;
- o total do boleto deve ser reconciliado com a soma das custas dos títulos relacionados. Essa conferência fechou em 100% dos 230 boletos dos dois lotes analisados.

Para novos lotes, o formato preferencial será:

```text
PDF original + manifest.csv
```

O manifesto deverá conter, no mínimo, `campaign_id`, `letter_batch_id`, `boleto_id`, `protocol_number`, `protocol_date`, `title_number`, `debtor_hash`, `delivery_provider`, `tracking_code`, `issued_at`, `due_date` e `amount`.

### 6.4 Metadados da campanha

Cada campanha deverá possuir um pequeno arquivo de configuração, preenchido manualmente ou gerado pelo sistema:

```yaml
campaign_id: CAMP-2026-11-001
name: Autorizacoes 2024-2025 - DDA e e-mail
created_at: 2026-11-03T09:00:00-03:00
reference_period:
  start: 2024-01-01
  end: 2025-12-31
channels:
  - dda
  - email
due_date: 2026-11-30
generated_by: usuario_interno
filters:
  high_value_only: false
  exclude_participants_after: 2026-10-01
  notice_only: false
status: generated
notes: null
```

### 6.5 Fontes futuras

- relatório de boletos pagos por usuário;
- histórico de ligações;
- eventos do WhatsApp institucional;
- entregas e retornos de e-mail;
- cartas emitidas, entregues e devolvidas;
- custos por canal;
- relatório de títulos aptos à campanha;
- relatório de autorizações de cancelamento;
- dados de produtividade por colaborador.

## 7. Identificação e relacionamento dos registros

### 7.1 Identificador preferencial

O primeiro CSV demonstra que o Charta fornece o campo `PROTOCOLO` no formato `numero - data`. No MVP, a chave de título preferencial será:

```text
protocol_number + protocol_date
```

Quando a fonte não trouxer essa combinação, será utilizada uma chave composta normalizada:

```text
protocolo + data_protocolo + numero_titulo + apresentante_normalizado
```

O número do processo, livro/folha e identificador do boleto podem funcionar como chaves auxiliares.

### 7.2 Regras de correspondência

1. Separar e normalizar número e data contidos no campo `PROTOCOLO`.
2. Correspondência exata por número e data do protocolo.
3. Validar apresentante, número do título e livro/folha quando disponíveis.
4. Relacionar devedores em tabela própria, deduplicada por protocolo e documento pseudonimizado.
5. Correspondência aproximada somente para fila de revisão humana.
6. Nunca aceitar correspondência aproximada como conversão automática.

### 7.3 Pseudonimização

CPF, CNPJ e nome completo não devem ser necessários para a maior parte das análises. Quando um identificador do devedor for indispensável, usar hash com segredo institucional, permitindo reconhecer recorrência sem expor o dado original.

## 8. Modelo de eventos

Cada título deverá formar uma linha do tempo:

```text
protesto/autorização
    -> elegibilidade para campanha
    -> inclusão em campanha
    -> tentativa de contato
    -> contato entregue ou atendido
    -> boleto gerado
    -> boleto pago
    -> pedido de cancelamento
    -> cancelamento praticado
```

Eventos sugeridos:

- `TITLE_ELIGIBLE`
- `CAMPAIGN_INCLUDED`
- `EMAIL_SENT`
- `EMAIL_DELIVERED`
- `WHATSAPP_SENT`
- `PHONE_ATTEMPTED`
- `PHONE_CONNECTED`
- `LETTER_ISSUED`
- `LETTER_DELIVERED`
- `BOLETO_ISSUED`
- `BOLETO_PAID`
- `CANCELLATION_REQUESTED`
- `CANCELLATION_COMPLETED`
- `CAMPAIGN_EXCLUDED`
- `CONTACT_FAILED`

## 9. Regras operacionais configuráveis

As regras deverão ficar em arquivos versionados por vigência, e não fixas no código. Parâmetros iniciais conhecidos incluem:

- campanhas retroativas menores, normalmente em blocos de até seis meses;
- avanço sucessivo sobre o acervo antigo;
- telefonia diária priorizando títulos de faixa alta;
- meta operacional de 15 boletos gerados por pessoa por dia;
- uso combinado de e-mail, WhatsApp e carta quando aplicável;
- campanhas mensais e diárias com vencimentos definidos pela gestão;
- tratamento separado para campanhas dentro e fora da comarca;
- conferência integral de críticas, endereço, e-mail e dados necessários;
- controle do tempo de análise de endereço;
- exclusão de títulos já cancelados, pagos, inválidos, duplicados ou alcançados por regra impeditiva.

O sistema deverá registrar a versão da regra utilizada em cada campanha para permitir comparação histórica correta.

## 10. Métricas principais

### 10.1 Funil

- títulos elegíveis;
- títulos selecionados;
- contatos tentados;
- contatos entregues ou atendidos;
- boletos gerados;
- boletos pagos;
- pedidos de cancelamento;
- cancelamentos concluídos.

### 10.2 Conversão

- conversão em 3, 7, 15 e 30 dias;
- conversão até o vencimento;
- conversão por campanha;
- conversão por canal;
- conversão por apresentante;
- conversão por idade do protesto;
- conversão por faixa de valor;
- conversão por tipo de pessoa;
- conversão por colaborador;
- conversão por dia da semana e horário do contato.

### 10.3 Financeiro

- receita esperada e realizada;
- receita por título contatado;
- receita por boleto emitido;
- receita por canal;
- custo por contato;
- custo por cancelamento;
- retorno sobre o custo da campanha;
- valor médio e mediano dos cancelamentos.

### 10.4 Qualidade operacional

- duplicidade de contatos;
- títulos sem chave de relacionamento;
- divergências de dados;
- boletos sem campanha identificada;
- cancelamentos sem título correspondente;
- contatos acima da capacidade operacional;
- tempo entre geração do boleto, pagamento e cancelamento.

## 11. Atribuição e janelas de conversão

O MVP deverá apresentar pelo menos três visões:

1. **Conversão observada:** cancelamento posterior ao início da campanha dentro da janela escolhida.
2. **Conversão atribuída:** correspondência do título mais evidência de contato ou boleto da campanha.
3. **Conversão incremental estimada:** diferença entre o grupo tratado e um grupo comparável não tratado.

Janelas iniciais sugeridas:

- 3 dias;
- 7 dias;
- 15 dias;
- 30 dias;
- até o vencimento do boleto.

Quando o mesmo título participar de mais de uma campanha, o sistema deverá aplicar uma política configurável, como:

- último contato válido;
- primeiro contato da jornada;
- divisão proporcional;
- campanha com boleto pago;
- revisão manual em caso de conflito.

## 12. Score de propensão ao cancelamento

### 12.1 Resultado previsto

Probabilidade de um título ser cancelado dentro de determinada janela após a ação da campanha.

### 12.2 Variáveis candidatas

- tempo desde o protocolo ou protesto;
- tempo desde a autorização de cancelamento;
- apresentante normalizado;
- espécie do título, quando disponível;
- valor da dívida e valor do cancelamento;
- pessoa física ou jurídica;
- quantidade de títulos do mesmo devedor;
- existência de e-mail, telefone e endereço utilizáveis;
- histórico de tentativas anteriores;
- histórico de boletos emitidos, vencidos e pagos;
- canal utilizado;
- dia da semana e horário;
- vencimento e quantidade de dias concedidos;
- região, CEP ou dentro/fora da comarca;
- campanhas anteriores do mesmo título;
- resultado de títulos semelhantes.

### 12.3 Modelos

Ordem recomendada:

1. regras e tabelas de conversão por segmento;
2. regressão logística explicável;
3. árvores de decisão ou gradient boosting;
4. análise de sobrevivência para estimar tempo até o cancelamento;
5. uplift modeling para estimar o efeito incremental de cada canal.

O projeto não deve começar com um modelo complexo. Primeiro é necessário validar chaves, qualidade dos dados e atribuição.

### 12.4 Explicação da recomendação

Exemplo:

```text
Score: 82/100
Recomendação: telefone + WhatsApp, vencimento em 5 dias
Motivos principais:
- apresentante com alta conversão histórica;
- protesto dentro da faixa de idade mais responsiva;
- título de faixa alta;
- telefone válido disponível;
- nenhum contato realizado nos últimos 30 dias.
```

## 13. Motor de recomendação

O motor deverá executar quatro etapas:

### 13.1 Elegibilidade

Aplicar regras jurídicas e operacionais para definir quais títulos podem entrar na campanha.

### 13.2 Priorização

Ordenar títulos por uma função que combine:

```text
probabilidade de conversão
x receita esperada
- custo do contato
- risco operacional
- penalidade por contatos recentes
```

### 13.3 Otimização da capacidade

Respeitar:

- meta e capacidade por colaborador;
- quantidade de ligações possível por dia;
- limite de cartas;
- orçamento por canal;
- prazo de vencimento;
- volume máximo de conferência e geração de boletos.

### 13.4 Aprovação

Apresentar uma prévia com:

- quantidade de títulos;
- segmentos escolhidos;
- canais;
- vencimentos;
- receita projetada;
- conversão projetada;
- principais regras aplicadas;
- exclusões e respectivos motivos.

A campanha só deverá ser exportada após aprovação de usuário autorizado.

## 14. Testes de estratégia

O sistema deverá permitir testes A/B controlados, por exemplo:

- telefone versus telefone + WhatsApp;
- e-mail versus e-mail + DDA;
- vencimento curto versus vencimento mais longo;
- títulos recentes versus antigos;
- faixa alta versus seleção mista;
- carta simples versus carta seguida de ligação;
- primeira tentativa em diferentes dias e horários.

Para evitar viés, o sorteio dos grupos deverá ocorrer dentro de segmentos semelhantes.

## 15. Projeções

Antes de gerar uma campanha, o sistema deverá estimar:

- cancelamentos esperados;
- intervalo de confiança;
- receita esperada;
- quantidade prevista de boletos;
- carga de trabalho por colaborador;
- custo estimado por canal;
- prazo provável de conversão;
- cenários conservador, base e otimista.

Enquanto não houver histórico atribuído às campanhas, as projeções devem aparecer como **experimentais** e usar faixas amplas de incerteza.

## 16. Arquitetura recomendada

### 16.1 MVP

```text
CSV/PDF exportado do Charta
        |
        v
Validação e importação
        |
        v
Banco analítico local
        |
        +--> Painel de resultados
        +--> Relatório de qualidade
        +--> Recomendações de campanha
        +--> Exportação de lista aprovada
```

### 16.2 Stack sugerida

- **Python 3.12** para ingestão, validação e modelos;
- **Polars ou Pandas** para transformação;
- **DuckDB** no MVP;
- **PostgreSQL** quando houver múltiplos usuários e integração contínua;
- **FastAPI** para serviços e futura integração;
- **Pydantic** para contratos de dados;
- **scikit-learn** e **LightGBM** para modelos;
- **MLflow** para versões de modelos, em fase posterior;
- **Metabase**, **Superset** ou painel próprio para indicadores;
- **Docker Compose** para implantação reproduzível na rede interna.

### 16.3 Evolução de integração

1. Upload manual de CSV e PDF.
2. Pasta monitorada na rede interna.
3. Importação agendada de exportações do Charta.
4. Integração somente leitura, se tecnicamente disponível.
5. Exportação de campanhas recomendadas em formato compatível.
6. Criação assistida no Charta, com confirmação humana.
7. Automação de rotinas autorizadas, com logs e possibilidade de reversão.

## 17. Modelo inicial de dados

Tabelas sugeridas:

### `titles`

- `title_id`
- `protocol_number`
- `protocol_date`
- `title_number`
- `presenter_id`
- `debtor_hash`
- `person_type`
- `protest_date`
- `authorization_date`
- `debt_amount`
- `cancellation_amount`
- `status`

### `campaigns`

- `campaign_id`
- `name`
- `created_at`
- `start_date`
- `end_date`
- `due_date`
- `rule_version`
- `communication_template_version`
- `status`
- `approved_by`
- `approved_at`

### `campaign_participants`

- `campaign_id`
- `title_id`
- `selected_at`
- `score`
- `priority`
- `recommended_channel`
- `exclusion_reason`

### `contact_events`

- `event_id`
- `campaign_id`
- `title_id`
- `channel`
- `event_type`
- `event_at`
- `user_id`
- `result`

### `letter_batches`

- `letter_batch_id`
- `campaign_id`
- `delivery_provider`
- `source_file_id`
- `issued_at`
- `due_date`
- `page_count`
- `letter_count`
- `declared_amount`
- `extracted_amount`
- `reconciliation_status`
- `template_version`

### `letters`

- `letter_id`
- `letter_batch_id`
- `debtor_hash`
- `person_type`
- `tracking_code`
- `delivery_status_raw`
- `delivery_status_normalized`
- `delivered_at`
- `returned_at`

### `boletos`

- `boleto_id`
- `campaign_id`
- `letter_id`
- `issued_at`
- `due_date`
- `amount`
- `paid_at`
- `status`

### `boleto_titles`

- `boleto_id`
- `title_id`
- `cancellation_amount`
- `match_method`
- `match_confidence`

### `cancellations`

- `cancellation_id`
- `title_id`
- `request_number`
- `request_date`
- `process_number`
- `cancelled_at`
- `book_page`
- `source_file_id`

### `attributions`

- `cancellation_id`
- `campaign_id`
- `attribution_method`
- `confidence`
- `window_days`
- `review_status`

### `import_runs`

- `import_id`
- `source_name`
- `file_hash`
- `imported_at`
- `row_count`
- `accepted_count`
- `rejected_count`
- `schema_version`
- `errors`

## 18. Estrutura sugerida do repositório

```text
.
├── README.md
├── pyproject.toml
├── docker-compose.yml
├── .env.example
├── config/
│   ├── campaign_rules/
│   ├── presenter_aliases.yml
│   └── schemas/
├── data/
│   ├── sample/
│   └── README.md
├── src/
│   ├── ingestion/
│   ├── validation/
│   ├── normalization/
│   ├── attribution/
│   ├── analytics/
│   ├── forecasting/
│   ├── scoring/
│   ├── recommendation/
│   ├── api/
│   └── audit/
├── dashboards/
├── notebooks/
├── tests/
│   ├── fixtures/
│   ├── unit/
│   ├── integration/
│   └── data_quality/
├── scripts/
└── docs/
    ├── data_dictionary.md
    ├── campaign_rules.md
    ├── security.md
    └── model_card.md
```

## 19. Convenção de arquivos recebidos

```text
data/raw/YYYY-MM/
├── cancellations/
│   └── cancelamentos_YYYY-MM.pdf
├── campaigns/
│   └── CAMP-YYYY-MM-NNN/
│       ├── metadata.yml
│       ├── participants.csv
│       └── actions.csv
└── letters/
    └── CAMP-YYYY-MM-NNN/
        ├── LOTE-NNN-boletos.pdf
        └── manifest.csv
```

Regras:

- um diretório por campanha;
- nomes sem CPF, CNPJ ou nome de devedor;
- arquivos originais preservados sem alteração;
- hash do arquivo registrado na importação;
- arquivos corrigidos entram como nova versão;
- toda campanha recebe identificador único.

## 20. Qualidade de dados

Validações mínimas:

- protocolo preenchido e em formato válido;
- datas coerentes;
- cancelamento não anterior ao protocolo;
- campanha existente para cada participante;
- boleto vinculado a título e campanha;
- lote reconciliado por quantidade de páginas, cartas, títulos e valor;
- valor do boleto igual à soma das custas dos títulos relacionados;
- protocolo obrigatório no manifesto quando não estiver impresso no PDF;
- código de rastreio único quando o modelo de entrega o fornecer;
- motivo de entrega ou devolução preservado na forma original e normalizado por tabela versionada;
- ausência de duplicidade da chave do título;
- apresentante normalizado;
- canal pertencente ao catálogo permitido;
- status pertencente ao catálogo permitido;
- CPF/CNPJ não exposto em logs ou relatórios desnecessários;
- reconciliação entre total do relatório e total importado.
- distinção entre linha de origem, protocolo-devedor e protocolo único;
- detecção de repetição combinatória em protocolos com vários devedores;
- valores de custas e do título consistentes entre linhas do mesmo protocolo;
- cálculo de potencial financeiro somente no nível do protocolo;
- taxa de preenchimento por coluna, sem presumir contato disponível.
- bloqueio de protocolos cancelados antes da data de geração da campanha;
- relatório de pré-processamento com títulos excluídos e respectivos motivos.

Registros rejeitados devem ir para uma fila de correção, nunca ser descartados silenciosamente.

## 21. Segurança, LGPD e governança

- implantação preferencial na rede interna;
- controle de acesso por perfil;
- criptografia em trânsito e em repouso;
- trilha de auditoria imutável para importações e aprovações;
- pseudonimização de devedores;
- mascaramento de dados em ambiente de desenvolvimento;
- política de retenção e descarte;
- backups testados;
- segregação entre desenvolvimento, teste e produção;
- nenhuma execução automática no Charta sem autorização formal e controles definidos;
- nenhuma base real em serviço externo sem avaliação e autorização institucional;
- relatórios gerenciais devem evitar dados pessoais quando agregados forem suficientes.

## 22. Roadmap

### Fase 0 - Dicionário e qualidade

- receber os demais CSVs e os manifestos dos lotes de carta;
- consolidar o dicionário iniciado com o primeiro CSV;
- normalizar apresentantes;
- implementar chave `protocol_number + protocol_date`;
- implementar deduplicação nos três níveis definidos;
- implementar os dois importadores de PDF identificados;
- modelar a relação de muitos para muitos entre boleto e título;
- validar totais do relatório.

### Fase 1 - Base histórica

- importar cancelamentos;
- importar campanhas separadamente;
- importar boletos de carta;
- criar linha do tempo do título;
- produzir relatório de inconsistências.

### Fase 2 - Painel e atribuição

- funil por campanha;
- conversão por janela;
- resultados por canal e segmento;
- regras de atribuição;
- revisão manual de correspondências duvidosas.

### Fase 3 - Recomendações por regras

- ranking por segmento;
- exclusões automáticas justificadas;
- limite por capacidade;
- projeções por médias históricas;
- exportação da campanha aprovada.

### Fase 4 - Modelos preditivos

- score explicável;
- validação temporal;
- monitoramento de desempenho;
- cenários de receita;
- model card e aprovação da versão.

### Fase 5 - Experimentação

- testes A/B;
- grupos de controle;
- medição de efeito incremental;
- recomendação de canal e vencimento.

### Fase 6 - Integração com o Charta

- leitura controlada;
- geração assistida;
- aprovação antes da execução;
- logs completos;
- automação apenas de rotinas formalmente autorizadas.

## 23. Critérios de sucesso do MVP

O MVP será considerado válido quando conseguir:

1. importar um relatório mensal de cancelamentos sem perda de registros;
2. importar separadamente os CSVs de campanhas;
3. importar ou reconciliar boletos de carta;
4. relacionar títulos entre as fontes com taxa de correspondência mensurável;
5. identificar cancelamentos observados e atribuídos;
6. calcular conversão em 3, 7, 15 e 30 dias;
7. exibir resultados por campanha, canal, apresentante e idade;
8. impedir dupla contagem;
9. gerar recomendação explicável de uma nova campanha;
10. exportar a seleção aprovada com trilha de auditoria.

Metas técnicas iniciais sugeridas:

- 100% dos arquivos com hash e registro de importação;
- 100% das exclusões com motivo;
- pelo menos 95% dos títulos relacionados de forma determinística após ajuste do dicionário;
- nenhuma informação pessoal em logs de aplicação;
- reconciliação dos totais do relatório antes da publicação dos indicadores.

## 24. Primeiras hipóteses a testar

1. Títulos recentes convertem mais, mas o acervo antigo pode apresentar maior receita marginal quando bem segmentado.
2. O efeito do canal varia por apresentante e idade do protesto.
3. Campanhas combinadas convertem mais que um único contato, mas podem aumentar custo e saturação.
4. Vencimentos muito curtos reduzem conversão em alguns segmentos; vencimentos muito longos adiam a decisão.
5. Pessoas com vários títulos podem responder melhor a uma comunicação consolidada.
6. A concentração em poucos apresentantes permite modelos específicos com ganho relevante.
7. Parte expressiva dos cancelamentos ocorre sem influência da campanha; medir o efeito incremental evitará superestimar resultados.
8. A ordem da ligação deve considerar receita esperada por minuto de trabalho, não apenas valor individual do título.
9. O Lote 01 e o Lote 02 têm públicos e valores suficientemente diferentes para exigir metas, custos e taxas de conversão separados.
10. A escolha entre Correios e Fast Express deve considerar custo por entrega válida e por cancelamento incremental, não apenas custo por carta emitida.

## 25. Próximos dados necessários

Para concluir o dicionário e iniciar a Fase 0:

- um CSV de campanha com telefone efetivamente preenchido;
- um CSV de campanha com e-mail efetivamente preenchido;
- o manifesto ou exportação do Charta que originou cada lote de carta, especialmente o protocolo dos itens do Lote 02;
- custos de postagem/entrega de Correios e Fast Express;
- retorno de entrega, devolução e motivo por carta;
- relatório de boletos pagos por usuário, se disponível;
- descrição dos significados das colunas que não forem autoexplicativas;
- confirmação de que número e data do protocolo identificam unicamente o título no fluxo de campanha;
- informação sobre outros formatos de exportação disponíveis.

Os arquivos podem ser anonimizados, desde que o mesmo título conserve um identificador consistente em todas as fontes.

## 26. Resultado esperado

Ao final da implantação, a gestão deverá conseguir selecionar um período e receber uma recomendação como:

```text
Campanha recomendada: novembro - faixa alta - telefone + WhatsApp
Títulos elegíveis: 1.840
Títulos priorizados: 320
Conversão estimada em 15 dias: 11,8% a 15,4%
Cancelamentos esperados: 38 a 49
Receita esperada: R$ X a R$ Y
Carga estimada: 4 colaboradores por 5 dias
Principais segmentos: PGE, PGFN e Enel
Excluídos: já cancelados, contato recente, dados insuficientes ou duplicidade
Confiança da projeção: média
```

O sistema deverá permitir abrir cada número, entender sua origem e revisar os títulos antes da exportação.

---

Este projeto é uma ferramenta de apoio à gestão. Regras jurídicas e operacionais deverão ser validadas e aprovadas pelo responsável competente antes de qualquer execução automática.
