# App Structure
A structure is an arrangement and organization of code best practices to make it easy to read

## Content
- App.js
- Public
- Views
- Router
- Controller
- Models

## App.js
- MongoDB configuration
- express-session configuration
- cors configuration to allow data to be passed
- helmet configuration for security issues
- ejs configuration to use templates
- db.js MongoDB CONNECTIONSTRING, listen on port 8080, and protect data using dotenv/package

## Public
- Logo, favicon
- Css app styles

## Views
- home.ejs page
- 404.ejs page

## Router
- index.js page, Authentication, Read, Create, Update, Remove User data
- 404 redirect router

## Controller
- App functions that connect user to his collections data to Models 
- Create sessions, Catch errors

## Models
- App functions that Create, Read, Update, Remove Users
- Read, Update User photos, likes, collections, shared followings
