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

const getToken = function(resource, apiver) {
    var options = {
        uri: `${process.env["MSI_ENDPOINT"]}/?resource=${resource}&api-version=${apiver}`,
        headers: {
            'Secret': process.env["MSI_SECRET"]
        }
    };
    rp(options)
        .then(function(tokenResponse){
            console.log(tokenResponse);    
            //return data;
            var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
            return callback(authorizationValue);
        })
        .catch(function(err){
            console.log(err);
        });
}

getToken("https://vault.azure.net", "2017-09-01", callback);

function callback(blah){
    console.log("Inside Blah");
    console.log(blah);
}

// function callMyMethod(){
//     getToken("https://vault.azure.net", "2017-09-01").then(function(data){
//         console.log("Hello World");
//         console.log(data);
//         console.log("Hello It Worked"); 
//     })
// }

const keyVaultClient = new KeyVault.KeyVaultClient(new KeyVault.KeyVaultCredentials(getToken));

keyVaultClient.getSecret("https://prashanthnodevault.vault.azure.net/secrets/AppSecret","","")
    .then(function(data){
        console.log("Woohoo");
    })
    .catch(function(err){
        console.log("Error while retrieving a secret value");
        console.log(err);
    })
//callMyMethod();

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);