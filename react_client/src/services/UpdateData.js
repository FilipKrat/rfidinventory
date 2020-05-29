export function UpdateData(type, userData, user_token){
  let BaseURL = '/';
  return new Promise((resolve, reject) => {
    fetch(BaseURL+type,{
      method: 'PUT',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': user_token,
                },
      body: JSON.stringify(userData)
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
