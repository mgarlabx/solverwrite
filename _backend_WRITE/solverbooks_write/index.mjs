import functions from './functions.mjs';
import pagePUT from './pagePUT.mjs';

export const handler = async (event) => {
  
  const method = functions.getMethod(event);
  const path = functions.getPath(event);
  const body = functions.getBody(event); 

  const userId = body.userId;
  if (!userId.includes('<CHAVE INTERNA DE ACESSO>')) {
    return {
      statusCode: 401,
      body: JSON.stringify('Not authorized'),
    };
  }

  
  let resp = '';
  
  if (path == '/page' && method == 'PUT') {
    resp = await pagePUT(body.pageJson); 
    
  }
  
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
  return response;
};
