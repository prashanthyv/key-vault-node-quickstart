var http = require('http');
var fs = require('fs');
const AuthenticationContext = require('adal-node').AuthenticationContext;
const rp = require('request-promise');
var request = require('request');
const KeyVault = require('azure-keyvault');


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

var options = {
    uri: `${process.env["MSI_ENDPOINT"]}/?resource=${"https://vault.azure.net"}&api-version=${"2017-09-01"}`,
    headers: {
        'Secret': process.env["MSI_SECRET"]
    }
};

const getToken = function(error, response, body) {
    if(error){
        console.log("Error occured", error);
    } else if(!error && response.statusCode === 200) {
        var parsedData = JSON.parse(body);
        var authorizationValue = parsedData.tokenType + ' ' + parsedData.accessToken;
        console.log(parsedData);
        return authorizationValue;
        
    }
}

request(options, getToken);

const keyVaultClient = new KeyVault.KeyVaultClient(new KeyVault.KeyVaultCredentials(getToken));

var vaultUri = "https://" + "PrashanthNodeVault" + ".vault.azure.net/";

// We're setting the Secret value here and retrieving the secret value
keyVaultClient.setSecret(vaultUri, 'my-secret', 'test-secret-value', {})
    .then( (kvSecretBundle, httpReq, httpResponse) => {
        console.log("Secret id: '" + kvSecretBundle.id + "'.");
        return keyVaultClient.getSecret(kvSecretBundle.id, {});
    })
    .then( (bundle) => {
        console.log("Successfully retrieved 'test-secret'");
        console.log(bundle);
    })
    .catch( (err) => {
        console.log(err);
    });

// getToken("https://vault.azure.net", "2017-09-01", callback);

// function callback(blah){
//     console.log("Inside Blah");
//     console.log(blah);
// }

// function callMyMethod(){
//     getToken("https://vault.azure.net", "2017-09-01").then(function(data){
//         console.log("Hello World");
//         console.log(data);
//         console.log("Hello It Worked"); 
//     })
// }

// const keyVaultClient = new KeyVault.KeyVaultClient(new KeyVault.KeyVaultCredentials(getToken));

// keyVaultClient.getSecret("https://prashanthnodevault.vault.azure.net/secrets/AppSecret","","")
//     .then(function(data){
//         console.log("Woohoo");
//     })
//     .catch(function(err){
//         console.log("Error while retrieving a secret value");
//         console.log(err);
//     })
//     callMyMethod();

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);