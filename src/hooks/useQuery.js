// hooks
import {useLocation} from "react-router-dom";
import {useMemo} from "react";  // 1 - usado para melhorar a performance da aplicação (salvando valores), 2- usado para identificar quando uma mudança ocorre em um elemento js.

export function useQuery() {
  const {search} = useLocation();  // pega os parâmetros da URL
  
  return useMemo(() => new URLSearchParams(search), [search]);  // quando 'search' for alterado, essa função é executada. 'URLSearchParams' é um obj. js que busca o parâmetro que está em 'search', na pesquisa.
}