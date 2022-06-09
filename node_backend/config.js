const dotenv = require('dotenv');
dotenv.config();

const secretServerKey    = process.env.SECRET_SERVER_KEY;
const databaseAddress    = process.env.DATABASE_ADDRESS;
const databasePort       = process.env.DATABASE_PORT;
const databaseUser       = process.env.DATABASE_USER;
const databasePassword   = process.env.DATABASE_PASSWORD;
const databaseName       = process.env.DATABASE_NAME;
const tableName          = process.env.TABLE_NAME;
const serverPort         = process.env.SERVER_PORT;
const wordpressBaseUrl   = process.env.WORDPRESS_BASE_URL;
const wordpressJwtPath   = process.env.WORDPRESS_JWT_PATH;
const authySocketPath    = process.env.NODE_AUTHENTICATED_SOCKET_PATH;
const nonAuthySocketPath = process.env.NODE_NON_AUTHENTICATED_SOCKET_PATH;

if(!secretServerKey){
    throw new Error(".env is missing SECRET_SERVER_KEY");
    secretServerKey = "really-secret-key-here"
}

if(!databaseAddress){
    throw new Error(".env is missing DATABASE_ADDRESS");
    databaseAddress = 'localhost'
}

if(!databasePort){
    throw new Error(".env is missing DATABASE_PORT");
    databasePort=3306;
}

if(!databaseUser){
    throw new Error(".env is missing DATABASE_USER");
    databaseUser='chatuser';
}

if(!databasePassword){
    throw new Error(".env is missing DATABASE_USER");
    databasePassword='ch@tU53r_p@55w0rd';
}

if(!databaseName){
    throw new Error(".env is missing DATABASE_NAME");
    databaseName='chatdb';
}

if(!tableName){
    throw new Error(".env is missing TABLE_NAME");
    tableName='chattable';
}

if(!serverPort){
    throw new Error (".env is missing SERVER_PORT");
    serverPort=3000
}

if(!wordpressBaseUrl){
    throw new Error(".env is missing WORDPRESS_BASE_URL");
    wordpressBaseUrl = "https://fm949.ca";
}

if(!wordpressJwtPath){
    throw new Error(".env is missing WORDPRESS_JWT_PATH");
    wordpressJwtPath = '/wp-json/jwt-auth/v1/token';
}

if(!authySocketPath){
    throw new Error(".env is missing NODE_AUTHENTICATED_SOCKET_PATH");
    authySocketPath = '/authy.io/'
}

if(!nonAuthySocketPath){
    throw new Error(".env is missing NODE_NON_AUTHENTICATED_SOCKET_PATH");
    nonAuthySocketPath = "/non-authy.io"
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
    wordpressJwtPath,
    authySocketPath,
    nonAuthySocketPath,
    clientOrigins
  };
