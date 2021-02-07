const UsersMONGOCOLLECTION = require("../db").db().collection("users");
const ProfileMONGOCOLLECTION = require("../db").db().collection("profile");
const SharedMONGOCOLLECTION = require("../db").db().collection("shared");
const LikesMONGOCOLLECTION = require("../db").db().collection("likes");
const FollowingsMONGOCOLLECTION = require("../db").db().collection("followings");
const CollectionsMONGOCOLLECTION = require("../db").db().collection("collections");
const ObjectID = require("mongodb").ObjectID;
const sanitizeHTML = require("sanitize-html");
const bcryptjs = require("bcryptjs");

const Profile = function(data) {
    this.data = data;
    this.errors = [];
};

Profile.prototype.ReadUserProfile = function(id) {
    return new Promise((resolve, reject) => {
      if (typeof(id) !== 'string') {
        reject();
        return;
      }
      ProfileMONGOCOLLECTION.findOne({ authorID: ObjectID(id) }).then(profileData => {
        let data = {
            email: profileData.email,
            portfolio: profileData.portfolio,
            location: profileData.location,
            instagramUsername: profileData.instagramUsername,
            twitterUsername: profileData.twitterUsername,
            bio: profileData.bio,
            interests: profileData.interests,
            checkMessage: profileData.checkMessage
        }
        resolve(JSON.stringify(data));
      }).catch(() => reject("Please try again later!"));;
    });
};

Profile.prototype.validate = function(id) {
    return new Promise(async (resolve, reject) => {
        let user = await UsersMONGOCOLLECTION.findOne({_id: ObjectID(id)});
        if (user.username !== this.data.username) {
            let usernameExists = await UsersMONGOCOLLECTION.findOne({username: this.data.username})
            if (usernameExists) {this.errors.push("That username is already taken.")}
        }
        if (user.email !== this.data.email) {
            // Only if email is valid then check to see if it's already taken
            let emailExists = await UsersMONGOCOLLECTION.findOne({email: this.data.email});
            if (emailExists) {this.errors.push("That email is already being used.")}
        }
        resolve()
    });
};

// update account information
Profile.prototype.UpdateUserProfile = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        await this.validate(id);

        if (!this.errors.length) {
            await UsersMONGOCOLLECTION.findOneAndUpdate(
                { _id: ObjectID(id) },
                { $set: {
                    firstname: this.data.firstname,
                    lastname: this.data.lastname,
                    username: this.data.username,
                    email: this.data.email,
                } }
            );
            await ProfileMONGOCOLLECTION.findOneAndUpdate(
                { authorID: ObjectID(id) },
                { $set: {
                    firstname: this.data.firstname,
                    lastname: this.data.lastname,
                    username: this.data.username,
                    email: this.data.email,
                    portfolio: this.data.portfolio,
                    location: this.data.location,
                    instagramUsername: this.data.instagramUsername,
                    twitterUsername: this.data.twitterUsername,
                    bio: sanitizeHTML(this.data.bio.replace(/ +/g, ' '), {allowedTags: [], allowedAttributes: {}}),
                    interests: this.data.interests,
                    checkMessage: this.data.checkMessage,
                } }
            );
            resolve("success");
        } else {
            reject(this.errors)
        }
    });
};

// update profile picture
Profile.prototype.UpdateUserProfilePhoto = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }        
        await ProfileMONGOCOLLECTION.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { profileImage: this.data.photo } }
        );
        resolve("success");
    });
};

// update user password
Profile.prototype.UpdateUserProfilePassword = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        
        await UsersMONGOCOLLECTION.findOne({ _id: ObjectID(id) }).then(async attemptedUser => {
            if (bcryptjs.compareSync(this.data.currentPassword, attemptedUser.password)) {
                if (bcryptjs.compareSync(this.data.password, attemptedUser.password)) {
                    return reject("Your new password must be different from your previous password.")
                }
                let salt = bcryptjs.genSaltSync(10)
                this.data.password = bcryptjs.hashSync(this.data.password, salt);
                await UsersMONGOCOLLECTION.findOneAndUpdate(
                    { _id: ObjectID(id) },
                    { $set: { password: this.data.password } }
                );
            } else {
                reject("failure")
            }
        });
        resolve("success");
    });
};

// close user account
Profile.prototype.CloseAccount = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        
        await UsersMONGOCOLLECTION.findOne({ _id: ObjectID(id) }).then(async attemptedUser => {
            if (bcryptjs.compareSync(this.data.password, attemptedUser.password)) {
                await UsersMONGOCOLLECTION.deleteOne({ _id: ObjectID(id) });
                await ProfileMONGOCOLLECTION.deleteOne({ authorID: ObjectID(id) });
                await SharedMONGOCOLLECTION.deleteOne({ authorID: ObjectID(id) });
                await LikesMONGOCOLLECTION.deleteOne({ authorID: ObjectID(id) });
                await FollowingsMONGOCOLLECTION.deleteOne({ authorID: ObjectID(id) });
                await CollectionsMONGOCOLLECTION.deleteOne({ authorID: ObjectID(id) });
            } else {
                return reject("failure")
            }
        });
        resolve("success");
    });
};

module.exports = Profile;
