const UsersMONGOCOLLECTION = require("../db").db().collection("users");
const ProfileMONGOCOLLECTION = require("../db").db().collection("profile");
const SharedMONGOCOLLECTION = require("../db").db().collection("shared");
const LikesMONGOCOLLECTION = require("../db").db().collection("likes");
const FollowingsMONGOCOLLECTION = require("../db").db().collection("followings");
const CollectionsMONGOCOLLECTION = require("../db").db().collection("collections");
const sanitizeHTML = require("sanitize-html");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const User = function(data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function() {
  if (typeof(this.data.firstname) !== "string") { this.data.firstname = "" };
  if (typeof(this.data.lastname) !== "string") { this.data.lastname = "" };
  if (typeof(this.data.username) !== "string") { this.data.username = "" };
  if (typeof(this.data.email) !== "string") { this.data.email = "" };
  if (typeof(this.data.password) !== "string") { this.data.password = "" };

  this.data = {
    firstname: this.data.firstname.replace(/ +/g, '').toLowerCase(),
    lastname: this.data.lastname.replace(/ +/g, '').toLowerCase(),
    username: this.data.username.replace(/ +/g, '').toLowerCase(),
    email: this.data.email.replace(/ +/g, '').toLowerCase(),
    password: sanitizeHTML(this.data.password, {allowedTags: [], allowedAttributes: {}}),
  }  
};

User.prototype.login = function() {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    UsersMONGOCOLLECTION.aggregate([
      { $match: {username: this.data.username} },
      { $lookup: {from: "profile", localField: "_id", foreignField: "authorID", as: "authorDocument"} },
      { $project: {password: 1, author: {
        $arrayElemAt: ["$authorDocument", 0]
      }} }
    ]).toArray().then(attemptedUser => {
      if (attemptedUser && bcryptjs.compareSync(this.data.password, attemptedUser[0].password)) {
        let { firstname, lastname, username, profileImage } = attemptedUser[0].author;
        let filterData = {
          _id: attemptedUser[0]._id,
          firstname,
          lastname,
          username,
          profileImage
        };
        resolve(JSON.stringify(filterData));
      } else {
        if (!attemptedUser) {
          return reject("Invalid username!");
        } else if (attemptedUser && !bcryptjs.compareSync(this.data.password, attemptedUser.password)) {
          return reject("Invalid passsword!");
        } reject("Invalid username / passsword!");
      }
    }).catch(() => reject("Invalid username / passsword!"));
  });
};

User.prototype.validate = function() {
  return new Promise(async (resolve, reject) => {
    // firstname
    if (this.data.firstname == "") {this.errors.push("You must provide a firstname.")}
    if (this.data.firstname.length > 0 && this.data.firstname.length < 3) {this.errors.push("Firstname must be at least 3 characters.")}
    if (this.data.firstname.length > 30) {this.errors.push("Firstname cannot exceed 30 characters.")}
    
    // lastname
    if (this.data.lastname == "") {this.errors.push("You must provide a lastname.")}
    if (this.data.lastname.length > 0 && this.data.lastname.length < 3) {this.errors.push("Lastname must be at least 3 characters.")}
    if (this.data.lastname.length > 30) {this.errors.push("Lastname cannot exceed 30 characters.")}
    
    // username
    if (this.data.username == "") {this.errors.push("You must provide a username.")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
      this.errors.push("Username can only contain letters and numbers.")
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
    if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}

    // email
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
    
    // password
    if (this.data.password == "") {this.errors.push("You must provide a password.")}
    if (this.data.password.length > 0 && this.data.password.length < 8) {this.errors.push("Password must be at least 8 characters.")}
    if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
    
    // Only if username is valid then check to see if it's already taken
    if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
      let usernameExists = await UsersMONGOCOLLECTION.findOne({username: this.data.username})
      if (usernameExists) {this.errors.push("That username is already taken.")}
    }
  
    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await UsersMONGOCOLLECTION.findOne({email: this.data.email})
      if (emailExists) {this.errors.push("That email is already being used.")}
    }
    resolve()
  });
};

// register a user and create (user, profileImage, shared, likes, collection, following) collection
User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.cleanUp()
    await this.validate()
    
    // Step #2: Only if there are no validation errors 
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcryptjs.genSaltSync(10)
      this.data.password = bcryptjs.hashSync(this.data.password, salt);
      const user = await UsersMONGOCOLLECTION.insertOne(this.data);
      const profile = {
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        username: this.data.username,
        email: this.data.email,
        portfolio: '',
        location: '',
        instagramUsername: '',
        twitterUsername: '',
        bio: '',
        interests: [ "wallpaper", "outdoor", "forest", "summer", "background" ],
        checkMessage: false,
        profileImage: '',
        authorID: user.ops[0]._id,
      };
      await ProfileMONGOCOLLECTION.insertOne(profile);
      let filterData = {
        _id: user.ops[0]._id,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        username: this.data.username,
        profileImage: '',
      };
      resolve(JSON.stringify(filterData));
      const shared = {
        shared: [],
        authorID: user.ops[0]._id
      }
      await SharedMONGOCOLLECTION.insertOne(shared);
      const likes = {
        likes: [],
        authorID: user.ops[0]._id
      }
      await LikesMONGOCOLLECTION.insertOne(likes);
      const followings = {
        followings: [],
        authorID: user.ops[0]._id
      }
      await FollowingsMONGOCOLLECTION.insertOne(followings);
      const collections = {
        collections: [],
        authorID: user.ops[0]._id
      }
      await CollectionsMONGOCOLLECTION.insertOne(collections);
    } else {
      reject(this.errors)
    }
  });
};

module.exports = User;
