const dotenv = require('dotenv');
dotenv.config();

const secretServerKey           = process.env.SECRET_SERVER_KEY;
const databaseAddress           = process.env.DATABASE_ADDRESS;
const databasePort              = process.env.DATABASE_PORT;
const databaseUser              = process.env.DATABASE_USER;
const databasePassword          = process.env.DATABASE_PASSWORD;
const databaseName              = process.env.DATABASE_NAME;
const tableName                 = process.env.TABLE_NAME;
const serverPort                = process.env.NODE_SERVER_PORT;
const wordpressBaseUrl          = process.env.WORDPRESS_BASE_URL;
const wordpressJwtLoginPath     = process.env.WORDPRESS_JWT_LOGIN_PATH;
const wordpressJwtRegisterPath  = process.env.WORDPRESS_JWT_REGISTER_PATH;
const authySocketPath           = process.env.NODE_AUTHENTICATED_SOCKET_PATH;
const nonAuthySocketPath        = process.env.NODE_NON_AUTHENTICATED_SOCKET_PATH;
const deployEnvironment         = process.env.DEPLOY_ENVIRONMENT;

if(!secretServerKey){
    throw new Error(".env is missing SECRET_SERVER_KEY");
}

if(!databaseAddress){
    throw new Error(".env is missing DATABASE_ADDRESS");
}

if(!databasePort){
    throw new Error(".env is missing DATABASE_PORT");
}

if(!databaseUser){
    throw new Error(".env is missing DATABASE_USER");
}

if(!databasePassword){
    throw new Error(".env is missing DATABASE_USER");
}

if(!databaseName){
    throw new Error(".env is missing DATABASE_NAME");
}

if(!tableName){
    throw new Error(".env is missing TABLE_NAME");
}

if(!serverPort){
    throw new Error (".env is missing SERVER_PORT");
}

if(!wordpressBaseUrl){
    throw new Error(".env is missing WORDPRESS_BASE_URL");
}

if(!wordpressJwtLoginPath){
    throw new Error(".env is missing WORDPRESS_JWT_LOGIN_PATH");
}

if(!wordpressJwtRegisterPath){
    throw new Error(".env is missing WORDPRESS_JWT_REGISTER_PATH");
}

if(!authySocketPath){
    throw new Error(".env is missing NODE_AUTHENTICATED_SOCKET_PATH");
}

if(!nonAuthySocketPath){
    throw new Error(".env is missing NODE_NON_AUTHENTICATED_SOCKET_PATH");
}

if(!deployEnvironment){
    throw new Error(".env is missing DEPLOY_ENVIRONMENT. It should be either 'DEVELOPMENT' or 'PRODUCTION'" );
}

// An array of URLs that you want NodeJS to allow CORS
const clientOrigins = ["http://localhost:4040"];

module.exports = {
    secretServerKey,
    databaseAddress,
    databasePort,
    databaseUser,
    databasePassword,
    databaseName,
    tableName,
    serverPort,
    wordpressBaseUrl,
    wordpressJwtLoginPath,
    wordpressJwtRegisterPath,
    authySocketPath,
    nonAuthySocketPath,
    deployEnvironment,
    clientOrigins
  };
