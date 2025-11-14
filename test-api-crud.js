// Script de teste da API - Execute no console do navegador
// após fazer login no sistema

async function testarCRUDSystems() {
  console.log('🧪 Iniciando teste de CRUD de Systems...\n');
  
  try {
    // 1. Criar sistema
    console.log('1️⃣ Criando sistema...');
    const createResponse = await fetch('https://backendgestor.sdbr.app/api/v1/plans/systems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        name: 'Sistema Teste CRUD',
        description: 'Teste de criação',
        code: 'TEST001',
        isActive: true
      })
    });
    
    const created = await createResponse.json();
    console.log('✅ Sistema criado:', created);
    
    if (!created.id && !created.data?.id) {
      console.error('❌ Resposta não contém ID:', created);
      return;
    }
    
    const systemId = created.id || created.data?.id;
    console.log(`📝 ID do sistema: ${systemId}\n`);
    
    // 2. Buscar sistema criado
    console.log('2️⃣ Buscando sistema...');
    const getResponse = await fetch(`https://backendgestor.sdbr.app/api/v1/plans/systems/${systemId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const fetched = await getResponse.json();
    console.log('✅ Sistema encontrado:', fetched, '\n');
    
    // 3. Atualizar com PATCH
    console.log('3️⃣ Atualizando com PATCH...');
    const patchResponse = await fetch(`https://backendgestor.sdbr.app/api/v1/plans/systems/${systemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        name: 'Sistema Teste CRUD Atualizado',
        description: 'Teste de atualização via PATCH'
      })
    });
    
    if (patchResponse.ok) {
      const patched = await patchResponse.json();
      console.log('✅ PATCH bem-sucedido:', patched, '\n');
    } else {
      console.error(`❌ PATCH falhou (${patchResponse.status}):`, await patchResponse.text());
      
      // 4. Tentar PUT como fallback
      console.log('4️⃣ Tentando PUT como fallback...');
      const putResponse = await fetch(`https://backendgestor.sdbr.app/api/v1/plans/systems/${systemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          name: 'Sistema Teste CRUD Atualizado',
          description: 'Teste de atualização via PUT',
          code: 'TEST001',
          isActive: true
        })
      });
      
      if (putResponse.ok) {
        const updated = await putResponse.json();
        console.log('✅ PUT bem-sucedido:', updated, '\n');
      } else {
        console.error(`❌ PUT também falhou (${putResponse.status}):`, await putResponse.text());
      }
    }
    
    // 5. Verificar atualização
    console.log('5️⃣ Verificando atualização...');
    const verifyResponse = await fetch(`https://backendgestor.sdbr.app/api/v1/plans/systems/${systemId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const verified = await verifyResponse.json();
    console.log('✅ Sistema após update:', verified, '\n');
    
    // 6. Deletar sistema
    console.log('6️⃣ Deletando sistema...');
    const deleteResponse = await fetch(`https://backendgestor.sdbr.app/api/v1/plans/systems/${systemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Sistema deletado com sucesso\n');
    } else {
      console.error(`❌ DELETE falhou (${deleteResponse.status}):`, await deleteResponse.text());
    }
    
    console.log('✅ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  }
}

// Executar teste
testarCRUDSystems();
