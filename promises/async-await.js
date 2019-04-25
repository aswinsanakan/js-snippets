/*
Error Handling on await
*/

// Create a wrapper that returns [err,data]
export default function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}

// Import the wrapper and use it on `await` 
[err, user] = await to(UserModel.findById(1));
if(err) throw new Error('No user found');
