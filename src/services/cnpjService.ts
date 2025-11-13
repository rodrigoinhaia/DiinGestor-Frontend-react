import axios from 'axios';

export interface CNPJData {
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
}

export const cnpjService = {
  /**
   * Busca dados de uma empresa pelo CNPJ usando BrasilAPI (via proxy)
   * Remove caracteres especiais do CNPJ antes da consulta
   */
  buscarPorCNPJ: async (cnpj: string): Promise<CNPJData> => {
    try {
      // Remove caracteres especiais do CNPJ
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
      
      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ deve conter 14 dígitos');
      }

      // Usa proxy local para evitar CORS (/cnpj-api -> brasilapi.com.br/api)
      const response = await axios.get(
        `/cnpj-api/cnpj/v1/${cnpjLimpo}`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      // Mapear resposta da BrasilAPI para nosso formato
      const data = response.data;
      const cnpjData: CNPJData = {
        razao_social: data.razao_social || data.nome_fantasia || '',
        nome_fantasia: data.nome_fantasia || '',
        cnpj: data.cnpj || cnpjLimpo,
        email: data.email || data.qsa?.[0]?.nome || '',
        telefone: data.ddd_telefone_1 || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
      };

      return cnpjData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('CNPJ não encontrado');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tempo de resposta excedido. Tente novamente.');
        }
      }
      throw new Error('Erro ao buscar dados do CNPJ');
    }
  },

  /**
   * Formata CNPJ para o padrão 00.000.000/0000-00
   */
  formatarCNPJ: (cnpj: string): string => {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    if (cnpjLimpo.length !== 14) {
      return cnpj;
    }

    return cnpjLimpo.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  },

  /**
   * Formata CEP para o padrão 00000-000
   */
  formatarCEP: (cep: string): string => {
    const cepLimpo = cep.replace(/[^\d]/g, '');
    
    if (cepLimpo.length !== 8) {
      return cep;
    }

    return cepLimpo.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  },

  /**
   * Formata telefone
   */
  formatarTelefone: (telefone: string): string => {
    const telLimpo = telefone.replace(/[^\d]/g, '');
    
    if (telLimpo.length === 11) {
      return telLimpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    
    if (telLimpo.length === 10) {
      return telLimpo.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return telefone;
  }
};
