
/*
 * GET echo page.
 */

exports.login = function(req, res){
  res.render('login', { title: 'LOGIN to THIS' });
};