const baseUrlDevelopment = process.env.REACT_APP_BASEURL_DEVELOPMENT
const baseUrlProduction  = process.env.REACT_APP_BASEURL_PRODUCTION
const socketAuthPath     = process.env.REACT_APP_SOCKET_AUTHPATH
const socketNonAuthPath  = process.env.REACT_APP_SOCKET_NONAUTHPATH
const loginPath          = process.env.REACT_APP_LOGIN_PATH
const registerPath       = process.env.REACT_APP_REGISTER_PATH
const streamUrlHiDef     = process.env.REACT_APP_STREAM_URL_HIDEF
const streamUrlMidDef    = process.env.REACT_APP_STREAM_URL_MIDDEF
const streamUrlLowDef    = process.env.REACT_APP_STREAM_URL_LOWDEF
const deployEnvironment  = process.env.REACT_APP_DEPLOYMENT_ENVIRONMENT

var nodeBaseUrl;

if(!baseUrlDevelopment){
    throw new Error(".env is missing REACT_APP_BASEURL_DEVELOPMENT")
}

if(!baseUrlProduction){
    throw new Error(".env is missing REACT_APP_BASEURL_PRODUCTION")
}

if(!socketAuthPath){
    throw new Error(".env is missing REACT_APP_SOCKET_AUTHPATH")
}

if(!socketNonAuthPath){
    throw new Error(".env is missing REACT_APP_SOCKET_NONAUTHPATH")
}

if(!loginPath){
    throw new Error(".env is missing REACT_APP_LOGIN_PATH")
}

if(!registerPath){
    throw new Error(".env is missing REACT_APP_REGISTER_PATH")
}

if(!streamUrlHiDef){
    throw new Error(".env is missing REACT_APP_STREAM_URL_HIDEF")
}

if(!streamUrlMidDef){
    throw new Error(".env is missing REACT_APP_STREAM_URL_MIDDEF")
}

if(!streamUrlLowDef){
    throw new Error(".env is missing REACT_APP_STREAM_URL_LOWDEF")
}

if(!deployEnvironment){
    throw new Error(".env is missing REACT_APP_DEPLOYMENT_ENVIRONMENT");
}

if(deployEnvironment=='DEVELOPMENT'){
    nodeBaseUrl = baseUrlDevelopment;
}
if(deployEnvironment=='PRODUCTION'){
    nodeBaseUrl = baseUrlProduction;
}

module.exports = {
    nodeBaseUrl,
    socketAuthPath,
    socketNonAuthPath,
    loginPath,
    registerPath,
    streamUrlHiDef,
    streamUrlMidDef,
    streamUrlLowDef,
    deployEnvironment
}