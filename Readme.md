# Authenticated Socket Connections 

A Node.js server relays socket connections. Socket connections require a 
JSON WebToken (JWT). JWT is served by WordPress. 

## SSR
Node.JS and WordPress should use the same ```SERVER_KEY_SECRET``` which is 
one half of the cryptographic key that encrypts the ```username``` and 
```password``` into the ```jsonwebtoken```

Client-Server sockets should be of two kinds. Authenticated and Non-Authetnticated. 
Incoming messages to the server arrive via Authenticated sockets. All outgoing messages are delivered via non-authentivated socket. 

## Config: Wordpress
### 1) Creating a new database and database user
Head over to Wordpress and create a new database ```chatdb```, a table called ```chattable``` and a new mysql user account ```chatuser``` with access privileges to the database ```chatdb```. If using a terminal to access the ```mysql``` server then use these commands.
```
$ sudo mysql
mysql> create database chatdb
mysql> use chatdb;
mysql> create table chattable ( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, socket_id VARCHAR(256) NOT NULL, username VARCHAR(256) NOT NULL, message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP );
mysql> CREATE USER 'chatuser'@'%' IDENTIFIED WITH mysql_native_password BY 'ch@tU53r_p@55w0rd';
mysql> GRANT ALL PRIVILEGES ON chatdb.* TO 'chatuser'@'%' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
mysql> exit;
```
### 2) Activating JSON WebTokens for your Wordpress site
First check if your Wordpress site has the Wordpress REST API enabled. It should be by default. 
Now, install any plugin that activates JSON webtokens for your site. Visit ```https://{your-site-name.com}/wp-json``` to check and make sure that the REST API is enabled. 
After installing the plugin of choice, the plugin will expose a new endpoint on your Wordpress site usually looking something like this ```https://{your-site-name.com}/wp-json/jwt-auth/v1/token ```. For this repository, I've installed <a href = "https://en.wordpress-plugins-list.com/jwt-authentication-for-wp-rest-api-enrique-chavez/"> this plugin by Enrique Chavez</a>.

Some plugins have a frontend UI which enable you to setup the SERVER-SECRET-KEY. For this plugin I had to edit the ```wp-config.php```. Add these two lines to the ```wp-config.php``` file right below the part where the Wordpress secret keys are defined. 
```
define('JWT_AUTH_SECRET_KEY', 'super-secret-super-long-phrase-that-is-used-to-sign-the-json-web-token');
define('JWT_AUTH_CORS_ENABLE', true);
```

### 3) Get User Roles from JWT plugin (optional)
Open the functions.php file and add the following lines of code 
```
add_filter('jwt_auth_token_before_dispatch', 'add_user_info_jwt', 10, 2);

function add_user_info_jwt($token, $user) {
    $token['roles'] = implode(',', $user->roles);;
    return $token;
}
```
Now the JWT payload will include the user's roles as well. 
This could help with restricting access based on admin/author/subscriber.


## Config: NodeJS Server

Create a file called ```.env``` in the home folder of the Node.JS Project. Add these lines to it
```
SECRET_SERVER_KEY='super-secret-super-long-phrase-that-is-used-to-sign-the-json-web-token'
DB_USER='chatuser'
DB_PWD='ch@tU53r_p@55w0rd'
DB_NAME='chatdb'
TABLE_NAME='chattable'
DB_PORT='3306'
DB_IP='localhost'
PORT='3000'
```

Install the client project dependencies:

```
npm install
```

Run the Node Server:

```bash
node index.js
```

##### Hey could JWTs be used for making an authenticated streaming-service? Is that it?

### Config: Client-Side Javascript
Fetch the JWT from WordPress by submitting a ```http(s) POST``` request to 
```https://{your-site-name.com}/wp-json/jwt-auth/v1/token``` 
Send the Login Form's submission to this address as a POST request. 

### NEXT STEPS 

#### 1) Get user's profile picture from here -- ```http://fm949.ca/wp-json/wp/v2/users```

#### 2) Enable HTTPS

#### 3) validate and sanitize user input

#### 4) enable user-registration by setting up SMPT server and enabling JWT to handle that.
I'm trying out a different plugin for the sake of this feature. [https://simplejwtlogin.com/docs]

#### 5) Use React Routers for switching between different quality version of stream. 

##### While setting up a whole server might seem overkill just for a chat, i could also setup a collaborative drawing pad and use the same authenticated/non-authenticated sockets for handling those events.
