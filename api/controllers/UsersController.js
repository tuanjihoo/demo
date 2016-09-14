/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	index: function (req, res) {
        if (req.session.authenticated) {
            res.view({user: req.session.authenticated});
        } else {
            res.redirect('/login');
        }
    },

    login: function(req, res) {
        if (!req.session.authenticated) {
            res.view();
        } else {
            res.redirect('/')
        }
    },

	loginAction: function (req, res) {
		if (!req.body.email || !req.body.password) {
			return res.json({status: 'error', data: {message: 'Email or password is empty'}})
		}

		Users.findOne({email: req.body.email})
			.then(function (user) {
                if (!user) {
                    return res.json({status: 'error', data: {message: 'Invalid email or password'}})
                } else {
                    Users.comparePassword(req.body.password, user, function (err, valid) {
                        if (err) {
                            return res.json({status: 'error', data: {message: 'forbidden'}})
                        }

                        if (!valid) {
                            return res.json({status: 'error', data: {message: 'Invalid password'}})
                        } else {
                            req.session.authenticated = user;
                            return res.json({status: 'success'});
                        }
                    });
                }
            }).catch(function(err) {
                return res.json({status: 'error', data: {message: 'System error'}})
            });
	},

    signup: function(req, res) {
        if (!req.session.authenticated) {
            res.view();
        } else {
            res.redirect('/')
        }
    },

	signupAction: function (req, res) {
		if (!req.body.email || !req.body.password) {
			return res.json({status: 'error', data: {message: 'Email or password is empty'}})
		}

		var info = {
			email: req.body.email,
			password: req.body.password
		}

		if (req.body.name) {
			info.name = req.body.name
		}

		Users.findOne({email: req.body.email})
			.then(function(user) {
                if (user) {
                    throw new Error('Email already exists');
                }

                return Users.create(info)
            }).then(function(userCreate) {
            	if (!userCreate) {
            		return res.json({status: 'error', data: {message: 'Created account error'}})
            	}

            	return res.json({status: 'success', data: {message: 'Created account successfully'}})
            }).catch(function(err) {
                return res.json({status: 'error', data: {message: 'System error'}})
            });
	},

    logout: function(req, res) {
        req.session.destroy(function(err) {
            return res.json({status: 'success'})
        });
    }
};

