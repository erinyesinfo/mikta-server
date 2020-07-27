const usersCollection = require("../db").db().collection("users");
const dataCollection = require("../db").db().collection("data");
const ObjectID = require("mongodb").ObjectID;
const sanitizeHTML = require("sanitize-html");
const bcryptjs = require("bcryptjs");

const Account = function(data) {
    this.data = data;
    this.errors = [];
};

Account.prototype.validate = function(id) {
    return new Promise(async (resolve, reject) => {
        let user = await usersCollection.findOne({_id: ObjectID(id)});
        if (user.username !== this.data.username) {
            let usernameExists = await usersCollection.findOne({username: this.data.username})
            if (usernameExists) {this.errors.push("That username is already taken.")}
        }
        if (user.email !== this.data.email) {
            // Only if email is valid then check to see if it's already taken
            let emailExists = await usersCollection.findOne({email: this.data.email});
            if (emailExists) {this.errors.push("That email is already being used.")}
        }
        resolve()
    });
};

// update account information
Account.prototype.updateUserAccount = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        await this.validate(id);

        if (!this.errors.length) {
            await usersCollection.findOneAndUpdate(
                { _id: ObjectID(id) },
                { $set: {
                    firstname: this.data.firstname,
                    lastname: this.data.lastname,
                    username: this.data.username,
                    email: this.data.email,
                } }
            );
            await dataCollection.findOneAndUpdate(
                { authorID: ObjectID(id) },
                { $set: {
                    user: {
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
                    }
                } }
            );
            resolve("success");
        } else {
            reject(this.errors)
        }
    });
};

// update user password
Account.prototype.updateUserPassword = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        
        await usersCollection.findOne({ _id: ObjectID(id) }).then(async attemptedUser => {
            if (bcryptjs.compareSync(this.data.currentPassword, attemptedUser.password)) {
                if (bcryptjs.compareSync(this.data.password, attemptedUser.password)) {
                    return reject("Your new password must be different from your previous password.")
                }
                let salt = bcryptjs.genSaltSync(10)
                this.data.password = bcryptjs.hashSync(this.data.password, salt);
                await usersCollection.findOneAndUpdate(
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

// update profile picture
Account.prototype.updatePhoto = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }        
        await dataCollection.findOneAndUpdate(
            { authorID: ObjectID(id) },
            { $set: { profileImage: this.data.photo } }
        );
        resolve("success");
    });
};

// close user account
Account.prototype.closeUserAccount = function(id) {
    return new Promise(async (resolve, reject) => {
        if (typeof(id) !== "string") {
            reject();
            return;
        }
        
        await usersCollection.findOne({ _id: ObjectID(id) }).then(async attemptedUser => {
            if (bcryptjs.compareSync(this.data.password, attemptedUser.password)) {
                await usersCollection.deleteOne({ _id: ObjectID(id) });
                await dataCollection.deleteOne({ authorID: ObjectID(id) });
            } else {
                return reject("failure")
            }
        });
        resolve("success");
    });
};

module.exports = Account;
