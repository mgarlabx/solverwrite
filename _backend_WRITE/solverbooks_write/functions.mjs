
const functions = {
    
    getAuthorization(event) {
        if (event.headers) {
            if (event.headers.authorization) {
                return event.headers.authorization;
            }
        } 
        return '';
    },
    
    getMethod(event) {
        if (event.requestContext) {
            if (event.requestContext.http) {
                if (event.requestContext.http.method) {
                    return event.requestContext.http.method;
                }   
            }
        } 
        return '';
    },

    getPath(event) {
        if (event.requestContext) {
            if (event.requestContext.http) {
                if (event.requestContext.http.path) {
                    return event.requestContext.http.path;
                }   
            }
        } 
        return '';
    },

    getBody(event) {
        let body = event.body;
        if (body) {
            try {
              body = JSON.parse(event.body); // when coming from application
            } catch(e) {
              body = event.body; // when coming from test
            }
        } else {
            body = {};
        }
        return body;
    },

    getQueryStringParameters(event) {
        let queryStringParameters = event.queryStringParameters;
        if (queryStringParameters) {
            try {
                queryStringParameters = JSON.parse(event.queryStringParameters); // when coming from application
            } catch(e) {
                queryStringParameters = event.queryStringParameters; // when coming from test
            }
        } else {
            queryStringParameters = {};
        }
        return queryStringParameters;
    },
    
    
    
   
    
    
};

export default functions;