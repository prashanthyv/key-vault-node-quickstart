var http = require('http');
const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');


var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Prashanth!");
});


msRestAzure.loginWithAppServiceMSI({resource: 'https://vault.azure.net'}).then( (credentials) => {
    const keyVaultClient = new KeyVault.KeyVaultClient(credentials);

    var vaultUri = "https://" + "PrashanthNodeVault" + ".vault.azure.net/";
    
    keyVaultClient.getSecret(vaultUri, "AppSecret", "").then(function(response){
        console.log(response);    
    })
    // We're setting the Secret value here and retrieving the secret value
    // keyVaultClient.setSecret(vaultUri, 'my-secret', 'test-secret-value', {})
    //     .then( (kvSecretBundle, httpReq, httpResponse) => {
    //         console.log("Secret id: '" + kvSecretBundle.id + "'.");
    //         return keyVaultClient.getSecret(kvSecretBundle.id, {});
    //     })
    //     .then( (bundle) => {
    //         console.log("Successfully retrieved 'test-secret'");
    //         console.log(bundle);
    //     })
    //     .catch( (err) => {
    //         console.log(err);
    //     });
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);