import { getAccessToken } from '../../../utils/helper';

export default async function handler(req, res) {
  let backendURL = process.env.SENECA_BACKEND_URL; 

  const {
    query: { id },
    method,
  } = req

  if (method === 'GET') {
    let todoURL = `${backendURL}/task/${id}`; 
    let token = getAccessToken(req);
    
    if(!token) return res.status(400).json({'errorMsg': "Bad Request"}); 

    try {
      const todosRaw = await fetch(todoURL, { 
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const todo = await todosRaw.json(); 

      return res.status(200).json(todo); 
      
    }catch (err) {
      return res.status(400).json({'errorMsg': "Bad Request"});   
    }  

  } else if (method == 'DELETE') {
    let todoURL = `${backendURL}/task/${id}`; 
    let token = getAccessToken(req);

    if(!token) return res.status(400).json({'errorMsg': "Bad Request"}); 

    try {
      const todosRaw = await fetch(todoURL, { 
        method: "DELETE", 
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const todo = await todosRaw.json(); 

      return res.status(200).json(todo); 
      
    }catch (err) {
      return res.status(400).json({'errorMsg': "Bad Request"});   
    }  
  }
  else if (method == 'PUT') {
    let todoURL = `${backendURL}/task/${id}`; 
    let token = getAccessToken(req);
    let body = JSON.stringify(req.body);  

    if(!token) return res.status(400).json({'errorMsg': "Bad Request"}); 
 
    try {
      const todosRaw = await fetch(todoURL, { 
        method: "PUT", 
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: body
      });

      const todo = await todosRaw.json(); 

      return res.status(200).json(todo); 
      
    }catch (err) {
      return res.status(400).json({'errorMsg': "Bad Request"});   
    }  
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
} 