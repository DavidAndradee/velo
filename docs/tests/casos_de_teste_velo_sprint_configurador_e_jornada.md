# Casos de Teste - Velô Sprint (Configurador e jornada do cliente)

Este documento contém casos de teste funcionais para o sistema Velô Sprint (SPA React), cobrindo a **Landing Page**, o **Configurador** (`/configure` — cor, rodas, opcionais, resumo de preço e CTAs), o **Checkout/Pedido**, a **Análise de Crédito Automática**, a **Confirmação** e a **Consulta de Pedidos**, conforme as regras de negócio e a interface observada no configurador.

---

## Módulo: Landing Page

### CT01 - Acessar Configurador via Landing Page (Fluxo Feliz)

#### Objetivo
Validar que a Landing Page redireciona corretamente para o Configurador de Veículo.

#### Pré-Condições
- O sistema deve estar no ar e acessível na URL inicial.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a página inicial (Landing Page). | A página carrega corretamente com as informações do Velô Sprint. |
| 2  | Clicar no botão principal "Configurar agora". | O usuário é redirecionado para a tela de configurações (`/configure`). |

#### Resultados Esperados
- O usuário navega para o módulo de configuração do veículo com sucesso.

#### Critérios de Aceitação
- Navegação entre as telas sem erros.

---

## Módulo: Configurador de Veículo (`/configure`)

### CT02 - Precificação dinâmica, rodas, opcionais e cor sem alteração de preço (Regras de Negócio / Fluxo Feliz)

#### Objetivo
Validar que o **Preço de Venda** reflete o valor base (R$ 40.000), os acréscimos de rodas Sport (+R$ 2.000), Precision Park (+R$ 5.500) e Flux Capacitor (+R$ 5.000), e que a **troca apenas de cor exterior** não altera o total.

#### Pré-Condições
- O usuário está na página do Configurador (`/configure`).
- Interface exibe seções **Cor**, **Rodas**, **Opcionais** e o resumo **Preço de Venda**.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Observar o estado inicial (cor padrão, rodas **Aero Wheels** com selo **Incluso**). | O **Preço de Venda** exibe **R$ 40.000,00**. |
| 2  | Alternar a cor entre **Glacier Blue**, **Midnight Black** e **Lunar White** (mantendo **Aero Wheels**). | A pré-visualização do veículo (imagem) acompanha a cor selecionada; o **Preço de Venda** permanece **R$ 40.000,00**. |
| 3  | Selecionar **Sport Wheels** (rótulo com **+ R$ 2.000,00**). | O **Preço de Venda** passa a **R$ 42.000,00**; a pré-visualização reflete rodas sport. |
| 4  | Marcar o opcional **Precision Park** (+ R$ 5.500,00). | Checkbox marcado; descrição do opcional visível; preço sobe para **R$ 47.500,00**. |
| 5  | Marcar o opcional **Flux Capacitor** (+ R$ 5.000,00). | Checkbox marcado; preço sobe para **R$ 52.500,00**. |
| 6  | Desmarcar **Precision Park**. | Preço recua para **R$ 47.000,00** (mantém Sport + Flux Capacitor). |

#### Resultados Esperados
- O resumo **Preço de Venda** atualiza de forma consistente com as regras de precificação; a cor não gera acréscimo monetário.

#### Critérios de Aceitação
- Soma e subtração corretas ao marcar/desmarcar opcionais e ao trocar rodas.
- Cores apenas atualizam apresentação visual, sem impacto no valor quando não há outros fatores de preço.

---

### CT03 - Prosseguir para o pedido a partir do configurador (Fluxo Feliz)

#### Objetivo
Garantir que o botão **Monte o Seu** encaminha o cliente para o fluxo de pedido com a URL de checkout, preservando o contexto da configuração para as etapas seguintes.

#### Pré-Condições
- Usuário em `/configure` com qualquer combinação válida de cor, rodas e opcionais.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Conferir o **Preço de Venda** exibido no configurador. | Valor coerente com as escolhas atuais. |
| 2  | Clicar em **Monte o Seu**. | A aplicação navega para a rota de checkout (`/order`). |

#### Resultados Esperados
- Transição do configurador para o módulo de pedido sem erro; a jornada continua na etapa de dados e pagamento.

#### Critérios de Aceitação
- URL final da etapa de checkout corresponde ao esperado (`/order`).

---

### CT04 - Retorno à página inicial a partir do configurador (Fluxo Alternativo)

#### Objetivo
Validar que o link da marca **Velô** (cabeçalho do configurador) retorna o usuário à Landing Page.

#### Pré-Condições
- Usuário em `/configure`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar no link **Velô** (logo/marca associada à raiz do site). | Navegação para a página inicial (`/`). |

#### Resultados Esperados
- O usuário abandona o configurador de forma explícita e volta ao conteúdo principal da SPA.

#### Critérios de Aceitação
- Carregamento da home sem erros de roteamento.

---

## Módulo: Checkout/Pedido

### CT05 - Validação de Campos Obrigatórios de Cadastro (Negativo)

#### Objetivo
Garantir que o formulário impeça a finalização do pedido com dados pendentes, mascarados incorretamente ou sem concordar com os termos.

#### Pré-Condições
- Veículo deve estar configurado.
- Usuário na página de Checkout (`/order`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Manter os campos (Nome, Sobrenome, E-mail, Telefone, CPF, Loja) e Termos vazios/não selecionados. | Sistema aceita o estado inicial do formulário em branco. |
| 2  | Clicar em "Confirmar Pedido". | Avisos de preenchimento obrigatório são exibidos abaixo dos campos aplicáveis (ex.: nome com mínimo de caracteres, etc.). |
| 3  | Preencher E-mail em formato inválido ("teste@email"). | Aviso de "Email inválido" é retornado. |
| 4  | Completar CPF faltando 1 dígito e Telefone faltando 1 dígito. | Aviso de "CPF inválido" e "Telefone inválido" são exibidos. |
| 5  | Preencher todos os campos corretamente, mas deixar "Termos" desmarcado. | Erro de "Aceite os termos" é acionado ao enviar pedido. |

#### Resultados Esperados
- Pedido bloqueado. Nenhuma requisição é feita à API.

#### Critérios de Aceitação
- Todo o schema Zod (ou validação equivalente) no frontend deve ser acionado.

---

### CT06 - Pedido com Pagamento à Vista (Fluxo Feliz)

#### Objetivo
Assegurar que um pedido completo, pago à vista e com dados corretos, seja criado com status APROVADO, sem acionar análise de crédito.

#### Pré-Condições
- Configurador preenchido (Sem adicionais, R$ 40.000).
- Dados do usuário totalmente preenchidos e válidos.
- Termos de uso aceitos.
- Modo de pagamento "À Vista" selecionado.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Constatar que o valor exibido é R$ 40.000 em parcela única. | O botão de financiamento exibe as informações inativas/ocultas. |
| 2  | Clicar em "Confirmar Pedido". | Tela de carregamento aparece. Em seguida o usuário é redirecionado. |

#### Resultados Esperados
- O pedido deve ser salvo via banco de dados sem checagem de score na API de Crédito. Status deve ser sempre `APROVADO`. Uma chave `order_number` é gerada.

#### Critérios de Aceitação
- Registro final contém Status = 'APROVADO' e redirect para a Confirmação.

---

## Módulo: Análise de Crédito Automática

### CT07 - Financiamento com Score > 700 (Regras de Negócio / Aprovado)

#### Objetivo
Testar a integração com a API de crédito em financiamentos (que geram parcelamento) de clientes em dia com bom score.

#### Pré-Condições
- Modificador: CPF fictício que retorna `Score = 800`.
- Formulário válido selecionado na aba "Financiamento".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher valor da entrada: R$ 0. | Interface lista detalhamento de financiamento de R$ 40.000. |
| 2  | Clicar "Confirmar Pedido". | Requisição enviada para API de Análise contendo o CPF. |

#### Resultados Esperados
- API retorna score > 700. O pedido é classificado para o status `APROVADO`.

#### Critérios de Aceitação
- A regra Score > 700 deve ser honrada sempre resultando em sucesso de financiamento.

---

### CT08 - Financiamento com Score entre 501 e 700 (Regras de Negócio / Em Análise)

#### Objetivo
Verificar o estado intermediário e de revisão manual perante score médio (501 a 700).

#### Pré-Condições
- Modificador: CPF fictício que retorna `Score = 650`.
- Formulário de Checkout em modo "Financiamento".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir Entrada < 50% (R$ 5.000). | Montante e parcela recalculados. |
| 2  | Clicar em Confirmar Pedido. | Loader exibe enquanto ocorre envio de dados à API. |

#### Resultados Esperados
- API responde com score de 650. O pedido é salvo no banco de dados com o status `EM_ANALISE`. O usuário finaliza sob o estado pendente.

#### Critérios de Aceitação
- O sistema retém o estado `EM_ANALISE` para ser revisto posteriormente e não bloqueia a criação do registro, mas também não dá aprovação total.

---

### CT09 - Financiamento com Score <= 500 (Regras de Negócio / Reprovado)

#### Objetivo
Proibir a liberação do financiamento para clientes sem credibilidade perante a API de Análise e sem aporte elevado (sem exceção).

#### Pré-Condições
- Modificador: CPF fictício que retorna `Score = 400`.
- Formulário em modo "Financiamento". Valor do veículo: R$ 40.000.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir Valor da Entrada = R$ 10.000 (25% do total). | O financiamento recai sobre R$ 30.000. |
| 2  | Confirmar pedido. | Requisição feita à integração. |

#### Resultados Esperados
- A API responde com score baixo. Como a entrada é de apenas 25% (regra da exceção não atendida), o fluxo condena a transação ao estado `REPROVADO`.

#### Critérios de Aceitação
- Cliente é desqualificado via status 'REPROVADO' salvo em banco, direcionado a tela final com a respectiva mensagem de rejeição.

---

### CT10 - Exceção de Crédito com Entrada >= 50% (Fluxo Alternativo)

#### Objetivo
Certificar que um cliente reprovado pela Análise de Crédito é automaticamente resgatado (aprovado) se ofertar uma entrada igual ou superior à metade do valor do bem.

#### Pré-Condições
- Veículo de R$ 40.000.
- CPF configurado para `Score = 300` (Reprovação).
- Pagamento via Financiamento.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher Valor da Entrada com R$ 20.000. | Valor atinge o percentual >= 50%. |
| 2  | Confirmar pedido. | Análise API é feita e retorna score baixo, porém interceptada por lógica interna. |

#### Resultados Esperados
- O pedido ignora o resultado adverso da análise de crédito graças ao fator mitigante da entrada >= 50% e cadastra a transação como `APROVADO`.

#### Critérios de Aceitação
- Regra de negócio de Entrada Alta sobrepõe, anulando reprovações exclusivas de score.

---

### CT11 - Cálculo das Parcelas de Financiamento (Regras de Negócio)

#### Objetivo
Validar que os juros adotados são 2% a.m em caráter composto e de obrigatoriedade sobre 12 vezes (meses). Fórmula de Price utilizada.

#### Pré-Condições
- Veículo Valor Base (R$ 40.000). Modo "Financiamento".

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar Entrada = R$ 0. | Saldo a financiar = R$ 40.000. |
| 2  | Observar as parcelas e juros exibidos na interface. | Parcelas são listadas como '12x de [Valor Calculado]'. |
| 3  | Digitar Entrada = R$ 20.000. | Saldo a financiar = R$ 20.000 e recalcula a parcela correspondente a juros compostos. |

#### Resultados Esperados
- Matemática de 2% composto ao longo do prazo fixo refletida de forma consistente na interface e no backend.

#### Critérios de Aceitação
- A matemática exposta deve coincidir estritamente com o multiplicador de juros sobre o prazo fixo (12x).

---

## Módulo: Confirmação

### CT12 - Visualização do Recibo/Confirmação (Fluxo Feliz)

#### Objetivo
Garantir que após a transação (em qualquer cenário salvo falha técnica) a tela seja montada com o status real e a numeração do pedido.

#### Pré-Condições
- O sistema concluiu a injeção do pedido com sucesso na respectiva persistência de dados e navega para `/success`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Aguardar redirect final de checkout. | Tela final exibe agradecimento e informações. |
| 2  | Procurar campo descritivo da Identificação ('order_number'). | Um ID alfa-numérico sob prefixo 'VLO-' é apresentado claramente. |

#### Resultados Esperados
- Mensagem dependente de contexto ("aprovado", "em analise"...) e código de referência (`order_number`) entregue com sucesso ao cliente.

#### Critérios de Aceitação
- Exibição de Resumo, Total, Tipo de Transação, Status do Pedido e Código rastreável.

---

## Módulo: Consulta de Pedidos

### CT13 - Consulta de Pedido via order_number com Sucesso (Segurança de Dados / Fluxo Feliz)

#### Objetivo
Comprovar que uma pesquisa restrita através unicamente do Localizador Privado (`order_number`) retorna exclusivamente os dados daquele documento, protegendo dados sistêmicos.

#### Pré-Condições
- Existência de pacote no BD com Id Fictício: `VLO-TEST12`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar tela de Busca/Login de Acompanhamento. | O input do `order_number` está pronto para uso. |
| 2  | Inserir termo `VLO-TEST12` e buscar. | Consulta enviada para backend para validação. |
| 3  | Confirmar o retorno visual. | Renderiza o detalhamento de apenas um pedido, com status, precificação e dados mascarados/resumidos. |

#### Resultados Esperados
- Busca bem sucedida exibe somente informações correlatas.

#### Critérios de Aceitação
- Privacidade rigorosa, requerendo credencial assertiva (`order_number`).

---

### CT14 - Falha Elegante em Consulta com Order Number Inválido (Negativo)

#### Objetivo
Manter coerência para digitação indesejada, IDs com letras faltando e manipulação do cliente sem revelar chaves do sistema.

#### Pré-Condições
- Acessibilidade do módulo de Consulta.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher o campo com chave incorreta "VLO-XPTO00". | O input é validado semanticamente (formato válido). |
| 2  | Enviar. | O backend procura, falha e retorna sem exceções expostas. |

#### Resultados Esperados
- Mensagem de erro simples ao usuário: "Pedido não localizado" ou genérica similar.

#### Critérios de Aceitação
- Tratamento sem 'stack traces', 'HTTP 500s', impedindo enumeramento malicioso.

---

### CT15 - Prevenir Acesso Sem order_number (Negativo / Segurança)

#### Objetivo
Prevenir listagens gerais com a ausência do hash de autorização.

#### Pré-Condições
- Área de formulário de Consulta limpa.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar o input "Número do Pedido" inteiramente vazio e enviar. | Validação frontend bloqueia a ação, requerendo o número de no mínimo X caracteres. |

#### Resultados Esperados
- Interface acusa dado faltante. Integração não envia requests vazios no payload da busca de BD (ou envia, mas o Supabase recusa pela política RLS).

#### Critérios de Aceitação
- Obrigatoriedade de fornecimento de `order_number`.

---
