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
After installing the plugin of choice, the plugin will expose a new endpoint on your Wordpress site usually looking something like this [https://{your-site.com}/wp-json/simple-jwt-login/v1/auth]. For this repository, I've installed <a href = "https://simplejwtlogin.com"> this plugin</a>.

### 3) Configuring the plugin
This plugin has a frontend UI for config that is accessible on the WP admin dashboard. 
Go to the ```General``` settings and type out your SECRET_SERVER_KEY. In this example I've used ```really-secret-key-here```. 
Go to ```Auth codes``` settings and type out another key under the <b>Authentication Key</b> column such as ```this-is-another-secret-key-for-registering-new-users```. <i>This is not essential but it adds extra security</i>
Now go to ```Authentication``` settings and enable user authentication. Make sure to check all boxes under JWT payload. Check the radio button for <b>Use Auth codes</b>
Go to the ```Register User``` and enable user registration and check <b>Use Auth codes</b>
Go to the <b>Hooks</b> settings and check the ```simple_jwt_login_response_auth_user``` option.  
Open the functions.php file and add the following lines of code 
```
function add_extra_dets_simple_jwt_login($payload,$user){
	$payload['user_info'] = $user;//this will add the user's full details
    return $payload;	
}
add_filter('simple_jwt_login_response_auth_user','add_extra_dets_simple_jwt_login',10, 2);
```
Now the JWT payload will return the user's info as well. This will help with restricting access based on whether the user's role is admin/contributor/subscriber. 


## Config: NodeJS Server

Create a file called ```.env``` in the home folder of the Node.JS Project. Add these lines to it
```
SECRET_SERVER_KEY='really-secret-key-here'
DATABASE_ADDRESS='134.122.42.192'
DATABASE_PORT='3306'
DATABASE_USER='chatuser'
DATABASE_PASSWORD='ch@tU53r_p@55w0rd'
DATABASE_NAME='chatdb'
TABLE_NAME='chattable'
NODE_SERVER_PORT='3000'
SERVER_SSL_KEY='/path/to/ssl-key.pem'
SERVER_SSL_CERT='/path/to/ssl-cert.pem'
NODE_AUTHENTICATED_SOCKET_PATH='/authy.io/'
NODE_NON_AUTHENTICATED_SOCKET_PATH='/non-authy.io/'
WORDPRESS_BASE_URL='fm949.ca'
WORDPRESS_JWT_LOGIN_PATH='/wp-json/simple-jwt-login/v1/auth'
WORDPRESS_JWT_REGISTER_PATH='/wp-json/simple-jwt-login/v1/users'
WORDPRESS_JWT_REGISTER_AUTH_KEY='this-is-another-secret-key-used-for-registering-new-users'
DEPLOY_ENVIRONMENT='DEVELOPMENT'
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

### Config: Client-Side React
Fetch the JWT from WordPress by submitting a ```http(s) POST``` request to ```${nodeBaseUrl}/login```. Node then forwards that Login Form to 
```https://{your-site-name.com}/wp-json/simple-jwt-login/v1/```. 
Node then receives the JWT Payload or an error message
If  ```payload.status=success``` then Node checks for ```payload.user_info.roles``` and maintains a server-side key-value pair of ```{username:alice, token:payload.jwt, tokenExp:}```
Send the Login Form's submission to this address as a POST request. 

Once you receive the JWT, then emit a specific socket.emit('joinRequest',jwt) to the server. the 
server authenticates the jwt and checks that it is (a) not expired (b) belongs to admin/contributor 
user

Use these three specific URLs for refreshing/validating/revoking JWT
REFRESH - ```POST``` -  [https://fm949.ca/?rest_route=/simple-jwt-login/v1/auth/refresh&JWT=YOUR_JWT]
VALIDATE - ```GET``` - [https://fm949.ca/?rest_route=/simple-jwt-login/v1/auth/validate&JWT=YOUR_JWT]
REVOKE - ```POST``` - [https://fm949.ca/?rest_route=/simple-jwt-login/v1/auth/revoke&JWT=YOUR_JWT]


### NEXT STEPS 

#### 1) Get user's profile picture from here -- ```http://fm949.ca/wp-json/wp/v2/users```

#### 2) Enable HTTPS

#### 3) validate and sanitize user input

#### 4) Use React Routers for switching between different quality version of stream. 

##### While setting up a whole server might seem overkill just for a chat, i could also setup a collaborative drawing pad and use the same authenticated/non-authenticated sockets for handling those events.

##### Toggling viz with React.Routers
Use React routers for swapping between <loginForm> <RegisterForm> and <ChatForm>. Maintain stat ```isAuthenticated``` for toggling routes <ChatForm> and <loginForm> and then use button-triggered routers for swapping between <loginForm> and <RegisterForm>. They have their ```URLs``` precoded within. 


#### Doubts
Am i throwing errors correctly? What errors from Node should i actually send over to React? Is that even a concern?


#### Fewer Sockets
Rather than using two separate sockets all you have to do is
    1) Initialize the non-authy socket connection with event listeners socket.send
    2) the server-side non-authy socket has an event listener socket.on('sendJwt',jwt). 
    3) client side non-authy socket has an event emitter socket.emit('sendJwt',jwt)
    2) when user submits socket.emit('sendJwt',jwt) then you 
    enable new event listeners on the Node side like socket.on('recvMesg',data)

#### Local Stprage
use vanilla javascript localStorage for storing jwts on React side
    1) localStorage.setItem('wordpressJwt',jwt)
    2) localStorage.setItem('wordpressJwtExp',1644847)
    3) anytime using jwt, check if localStorage.getItem('wordpressJwtExp') is yet to pass



#### READING
About JWTs - [https://blog.angular-university.io/angular-jwt/]
About Socket Rooms - [https://socket.io/docs/v3/rooms/]
Using React Sockets - 
[https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65]
An example Video Chat App - [https://github.com/lethanhvietctt5/video-chat-app]

