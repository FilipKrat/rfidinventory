export function DeleteData(type, user_token){
  let BaseURL = '/';
  return new Promise((resolve, reject) => {
    fetch(BaseURL+type,{
      method: 'DELETE',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': user_token,
                }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      resolve(responseJson);
    })
    .catch((error) => {
      reject(error);
    });
  });
}
