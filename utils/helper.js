const getAccessToken = (req) => {
  let token = req.headers['authorization'];
  console.log('token: ', token); 
  if(!token) return null;
  token = token.replace('Bearer ', '').trim(); 
  return token;
};

export { getAccessToken }