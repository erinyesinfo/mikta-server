# GUIDE Part2

![MiktaServer - Guide pt2](https://user-images.githubusercontent.com/59801428/106909935-09160b80-6701-11eb-8082-aa921a6dc1f8.png)

# How Mikta Server Works

### Express
- **express.static** to serve static files such as images, CSS files, and JavaScript files.
- **express.urlencoded** it parses incoming requests with urlencoded payloads and is based on body-parser.
- **express.json** is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.

### CORS
- **CORS** is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- **Cross-origin** resource sharing is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.

### Helmet
- **helmet** helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

### Dotenv
- **dotenv** is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

### express-sessions
- **express-sessions** is ExpressJS/Mongoose Session Storage

### connect-mongo
- **connect-mongo** is MongoDB session store for Connect DB to Express