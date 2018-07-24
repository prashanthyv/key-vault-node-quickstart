var http = require('http');
var fs = require('fs');
const KeyVault = require('azure-keyvault');
const AuthenticationContext = require('adal-node').AuthenticationContext;
const rp = require('request-promise');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Prashanth!");
});


// function getKeyVaultCredentials(){
//     return msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'});
// }

// function getKeyVaultSecret(credentials) {
//     let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
//     return keyVaultClient.getSecret(KEY_VAULT_URI, 'secret', "");
// }

// getKeyVaultCredentials().then(
//         getKeyVaultSecret
//     ).then(function (secret){
//         console.log(`Your secret value is: ${secret.value}.`);
//     }).catch(function (err) {
//         throw (err);
//     });


const getToken = function(resource, apiver, callback) {
    var options = {
        uri: `${process.env["MSI_ENDPOINT"]}/?resource=${resource}&api-version=${apiver}`,
        headers: {
            'Secret': process.env["MSI_SECRET"]
        }
    };
    rp(options)
        .then(function(data){
            console.log(data);
            callback(data);
        })
        .catch(function(err){
            console.log(err);
        });
}

getToken("https://vault.azure.net", "2017-09-01", callMyMethod())

function callMyMethod(data){
    console.log(data);
    console.log("Hello It Worked");
}

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);