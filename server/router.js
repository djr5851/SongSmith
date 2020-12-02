const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSongs', mid.requiresLogin, controllers.Song.getSongs);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/dashboard', mid.requiresLogin, controllers.Song.dashboardPage);
  app.post('/dashboard', mid.requiresLogin, controllers.Song.create);
  app.post('/deleteSong', mid.requiresLogin, controllers.Song.delete);
  app.post('/updateSong', mid.requiresLogin, controllers.Song.update);
  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  app.post('/account', mid.requiresLogin, controllers.Account.updateAccount);
  app.get('/getUsername', mid.requiresLogin, controllers.Account.getUsername);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  // handle 404
  app.use((req, res) => {
    res.status(404).send('<h1> Page not found </h1>');
  });
};

module.exports = router;
