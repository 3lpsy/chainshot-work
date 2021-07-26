const client = require("./client");

client.request("connect", [], function (err, response) {
  if (err) throw err;
  console.log(response.result); // success!
});
