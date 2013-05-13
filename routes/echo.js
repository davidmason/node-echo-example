
/*
 * GET echo page.
 */

exports.echo = function(req, res){
  res.render('echo', { title: 'ECHO' });
};