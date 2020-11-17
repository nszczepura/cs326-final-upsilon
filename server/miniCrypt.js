'use strict';
/*
  DISCLAIMER
  Implementing cryptographically sound behavior in software is both very important and very hard.
  As such, in practice you should take great caution and be extra certain of what you're doing.
  Given this, it's best to rely on existing code that has been battle-tested and vetted by those knowledgeable.

  Node.js provides a native cryptography module, by the name 'crypto'.
  This is essentially a JS wrapper around OpenSSL, a widely used and longstanding library written primarily in C that provides a vast array of cryptographic functions.

  If you'd like to learn more about the theory and maths behind cryptography, then take 466 next semester. Great professor.
 */
const crypto = require('crypto');
/**
  @module miniCrypt
  @desc A tiny crypto lib for the 326 kids.
 */
module.exports = (function() {
  /**
    @constructor
    @arg {number} its - The number of iterations to be performed; higher iterations means more security but slower speed.
    @arg {number} keyL - The length of the result in bytes.
    @arg {number} saltL - The amount of salt in bytes.
    @arg {string} saltL - The digest (i.e. hash) algorithm to use.
    @desc Creates a new `MiniCrypt` instance.
   */
  function MiniCrypt(its = 1e5, keyL = 64, saltL = 16, digest = 'sha256') {
    this.its = its;
    this.keyL = keyL;
    this.saltL = saltL;
    this.digest = digest;
  }

  /**
    @public
    @memberof MiniCrypt
    @arg {string} pw - The plain-text user password to be hashed.
    @returns {[string, string]} - An array containing (1) the salt used to hash the specified password, and (2) the hash itself.
    @desc Hash a user password.
   */
  MiniCrypt.prototype.hash = function(pw) {
    const salt = crypto.randomBytes(this.saltL).toString('hex'), // get our new salt for this pw
          hash = crypto.pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest).toString('hex'); // hash the pw
    return [salt, hash]; // return the pair for safe storage
  };

  /**
    @public
    @memberof MiniCrypt
    @arg {string} pw - The plain-text user password to be checked.
    @arg {string} salt - The salt associated with the user.
    @arg {string} hash - The hash associated with the user.
    @returns {Boolean} - A result of `true` iff `pw` & `salt` hash to `hash`.
    @desc Validate a user password.
   */
  MiniCrypt.prototype.check = function(pw, salt, hash) {
    return crypto.pbkdf2Sync(pw, salt, this.its, this.keyL, this.digest).toString('hex') === hash;
  };

  return MiniCrypt;
}());
