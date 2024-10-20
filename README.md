# Front-End do Sistema PDV

## Descrição
Aplicação front-end para o sistema de Ponto de Venda (PDV), desenvolvida em Angular. A aplicação permite gerenciar produtos, usuários e realizar operações de venda, integrando-se ao backend para autenticação e processamento de pagamentos.

## Funcionalidades Implementadas (RFs)
- [ ] **RF01:** Implementar página de cadastro de produtos.
- [ ] **RF02:** Implementar listagem de produtos com paginação.
- [ ] **RF03:** Implementar busca de produto por nome ou ID.
- [ ] **RF04:** Implementar formulário para atualização de produto.
- [ ] **RF05:** Implementar deleção de produto com confirmação.
- [x] **RF06:** Implementar integração com pagamento via PIX.
- [ ] **RF07:** Implementar verificação de status de pagamento.
- [ ] **RF08:** Implementar funcionalidade de solicitação de reembolso.
- [x] **RF09:** Implementar formulário de login com autenticação JWT.
- [ ] **RF10:** Implementar cadastro de novos usuários.
- [x] **RF11:** Implementar controle de permissões por nível de usuário (admin e operador).
- [ ] **RF12:** Implementar dashboard com relatório de vendas e produtos.
- [x] **RF13:** Implementar envio de e-mail para redefinição de senha.
- [ ] **RF14:** Implementar controle de estoque na interface do usuário.

## Regras de Negócio (RNs)
- [ ] **RN01:** Exibir mensagem de erro se o valor do produto for inferior a R$ 1,00.
- [ ] **RN02:** Bloquear a edição de produtos com pedidos pendentes.
- [ ] **RN03:** Exibir alerta quando o estoque estiver abaixo do mínimo definido.
- [ ] **RN04:** Permitir que o cliente cancele o pagamento antes de ser processado.
- [x] **RN05:** Mostrar QR Code para pagamento via PIX.
- [ ] **RN06:** Atualizar automaticamente o status do pedido após 30 minutos de espera.

## Requisitos Não-Funcionais (RNFs)
- [x] **RNF01:** Garantir que a aplicação seja responsiva para dispositivos móveis.
- [x] **RNF02:** Implementar caching de dados para melhorar o desempenho.
- [ ] **RNF03:** Integração fácil com serviços externos, como envio de e-mails.
- [ ] **RNF04:** Usar boas práticas de segurança na manipulação de dados sensíveis.

## Tecnologias Utilizadas
- **Angular:** Framework front-end.
- **RxJS:** Para programação reativa.
- **Tailwind css:** Para estilização e componentes de UI.
- **NgRx:** Para gerenciamento de estado (opcional).
- **JWT:** Para autenticação e autorização.
- **REST API:** Comunicação com o backend.

## Configuração do Ambiente de Desenvolvimento

Para configurar o ambiente de desenvolvimento e executar o projeto, siga os passos abaixo:

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Executar o servidor de desenvolvimento:**
   ```bash
   npx ng serve
   ```
   A aplicação estará disponível em `http://localhost:4200`.

3. **Gerar uma build de produção:**
   ```bash
   npx ng build
   ```


## Documentação e Links Úteis
- [Documentação do Angular](https://angular.io/docs)
- [Guia de Estilo do Angular](https://angular.io/guide/styleguide)
