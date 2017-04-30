import apiai from 'apiai';


const TOKEN = 'a0db4e6121b44d6f8bba13c4fcb73c26';
const app = apiai(TOKEN);


function getResponse(msg, successHandler, errorHandler) {
    const options = {
        sessionId: '6df08f97-051f-4228-92f1-bcbf8d554b4c' // some ramdon thing
    };
    const request = app.textRequest(msg, options);
    request.on('response', function(response) {
        console.log(response);
        successHandler(response);
    });
    request.on('error', function(error) {
        console.log(error);
        errorHandler(error);
    });
    request.end();
}

const apiaiApp = {
    getResponse: getResponse,
}

export default apiaiApp;
