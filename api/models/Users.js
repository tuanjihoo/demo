/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs')

module.exports = {

	attributes: {
		id: {
            type: 'integer',
            primaryKey: true,
            unique: true,
            columnName: 'id',
            autoIncrement: true
        },
        name: {
            type: 'string',
            size: 255
        },
        email: {
            type: 'email',
            email: true
        },
        password: {
            type: 'string',
            size: 32,
            minLength: 6,
            maxLength: 32
        },
        toJSON: function() {
            var obj = this.toObject()
            delete obj.password
            return obj
        }
	},

	beforeCreate : function (values, next) {
        if (values.password) {
            bcrypt.genSalt(10, function (err, salt) {
                if(err) return next(err)
                bcrypt.hash(values.password, salt, function (err, hash) {
                    if(err) return next(err)
                    values.password = hash
                    next()
                })
            })
        } else {
            return next()
        }
    },

	comparePassword : function (password, user, cb) {
        bcrypt.compare(password, user.password, function (err, match) {
            if (err) {
                return cb(err)
            }

            if (match) {
                cb(null, true)
            } else {
                cb(null, false)
            }
        })
    }
};

