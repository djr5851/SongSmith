const models = require('../models');

const { Account } = models;

// render login view
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// render account view
const accountPage = (req, res) => {
  res.render('account', { csrfToken: req.csrfToken() });
};

// handle logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// handle login attempt
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: 'dashboard' });
  });
};

// handle signup attempt
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/dashboard' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// handle password change
const updateAccount = (request, response) => {
  const req = request;
  const res = response;

  req.body.currentPass = `${req.body.currentPass}`;
  req.body.newPass = `${req.body.newPass}`;

  if (!req.body.currentPass || !req.body.newPass) {
    return res.status(400).json({ error: 'All fields are requred' });
  }

  const { username } = req.session.account;

  return Account.AccountModel.authenticate(username, req.body.currentPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      const updatedAccount = account;
      updatedAccount.salt = salt;
      updatedAccount.password = hash;

      const savePromise = updatedAccount.save();

      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(account);
        return res.json({ redirect: '/logout' });
      });

      savePromise.catch((saveErr) => {
        console.log(saveErr);
        return res.status(400).json({ error: 'An error occurred' });
      });
    });
  });
};

// return the username for the current session
const getUsername = (request, response) => {
  const req = request;
  const res = response;

  const usernameJSON = {
    username: req.session.account.username,
  };

  res.json(usernameJSON);
};

// request csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.accountPage = accountPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getUsername = getUsername;
module.exports.updateAccount = updateAccount;
