# Guia de Teste - CRUD de Sistemas e Módulos

## Preparação
1. Abra o navegador em: http://localhost:5173/products-systems
2. Abra o DevTools (F12)
3. Vá na aba **Console** para ver os logs detalhados

## Teste 1: Criar Sistema
1. Clique em "Novo Sistema"
2. Preencha:
   - Nome: "DIIN+ PDV"
   - Código: "PDV001"
   - Descrição: "Sistema de PDV completo"
   - Status: Ativo
3. Clique em "Salvar"
4. **Verifique no console:**
   - `📤 [systemsService] POST /plans/systems Payload:`
   - `✅ [systemsService] POST /plans/systems response:`
5. **Resultado esperado:** Sistema aparece na tabela

## Teste 2: Editar Sistema
1. Clique no botão de editar (lápis) no sistema criado
2. Altere o nome para: "DIIN+ PDV v2"
3. Clique em "Atualizar"
4. **Verifique no console:**
   - `📤 [systemsService] PATCH /plans/systems/{id} Payload:`
   - `✅ [systemsService] PATCH /plans/systems/{id} response:`
   - `📦 [systemsService] response.data:`
   - `🔄 [systemsService] normalized:`
5. **Se aparecer erro:**
   - Anote o status code e mensagem
   - Verifique se tentou fallback para PUT
6. **Resultado esperado:** Nome atualizado na tabela

## Teste 3: Criar Módulo
1. Vá na aba "MÓDULOS"
2. Clique em "Novo Módulo"
3. Preencha:
   - Nome: "Gestão de Comandas"
   - Sistema: Selecione "DIIN+ PDV v2"
   - Preço Repasse: 50.00
   - Preço Venda: 100.00
   - Status: Ativo
4. Clique em "Salvar"
5. **Verifique no console:**
   - `📤 [modulesService] POST /plans/modules Payload:`
   - `✅ [modulesService] POST /plans/modules response:`
6. **Resultado esperado:** Módulo aparece na tabela

## Teste 4: Editar Módulo
1. Clique no botão de editar no módulo criado
2. Altere:
   - Nome: "Gestão de Comandas e Pedidos"
   - Preço Venda: 120.00
3. Clique em "Atualizar"
4. **Verifique no console:**
   - `📤 [modulesService] PATCH /plans/modules/{id} Payload:`
   - `✅ [modulesService] PATCH /plans/modules/{id} response:`
   - `📦 [modulesService] response.data:`
   - `🔄 [modulesService] normalized:`
5. **Se aparecer erro:**
   - ❌ Status 400: Dados inválidos - verifique payload
   - ❌ Status 404: ID não encontrado - verifique se o ID está correto
   - ❌ Status 500: Erro no backend - verifique logs do servidor
6. **Resultado esperado:** Dados atualizados na tabela

## Possíveis Problemas e Soluções

### Problema 1: "Erro ao atualizar" sem detalhes
**Causa:** Backend retornando erro
**Solução:** Veja no console o objeto de erro completo

### Problema 2: Atualização não persiste
**Causa:** Cache do React Query não está invalidando
**Solução:** Verifique se os logs mostram refetch após update

### Problema 3: PATCH retorna 405 Method Not Allowed
**Causa:** Backend não suporta PATCH
**Solução:** O código já faz fallback para PUT automaticamente

### Problema 4: Dados não aparecem após criar
**Causa:** Envelope do backend não está sendo extraído corretamente
**Solução:** Verifique os logs de normalização

## Logs Importantes

### Sucesso
```
📤 [systemsService] PATCH /plans/systems/123 Payload: {...}
✅ [systemsService] PATCH response: AxiosResponse {...}
📦 response.data: { success: true, data: {...} }
🔄 normalized: { id: "123", name: "...", ... }
```

### Erro
```
❌ [systemsService] PATCH error: 400 { message: "..." }
```

## Após os Testes

Reporte aqui:
1. Qual teste falhou?
2. Qual mensagem de erro apareceu no console?
3. Qual o status code da resposta?
4. O payload enviado estava correto?

Com essas informações, posso corrigir o problema específico.
