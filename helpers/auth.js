// Exporta a função checkAuth como um middleware
module.exports.checkAuth = function (req, res, next) {
  console.log("User ID:", req.session.userId); // Loga o userId para debug

  // Obtém o userId da sessão do usuário
  const userId = req.session.userid;

  // Se o userId não estiver presente, redireciona o usuário para a página de login
  if (!userId) {
    console.log(userId);
    console.log("Usuário não autenticado!");
    return res.redirect("/login");
  }

  // Caso o userId exista, continua para o próximo middleware ou rota
  next();
};
