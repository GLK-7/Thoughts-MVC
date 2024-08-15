const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // password match validation
    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem, tente novamente!");
      return res.status(400).render("auth/register");
    }

    try {
      // check if user exists
      const checkIfUserExists = await User.findOne({ where: { email: email } });

      if (checkIfUserExists) {
        req.flash("message", "O e-mail já está sendo utilizado!");
        return res.status(400).render("auth/register");
      }

      // create a password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = {
        name,
        email,
        password: hashedPassword,
      };

      await User.create(user);

      // inicializa a sessão
      req.session.userid = user.id;

      req.session.save(() => {
        res.redirect("/");
      });
      req.flash("message", "Cadastro realizado com sucesso!");
      return res.status(201).redirect("/");
    } catch (error) {
      console.error(error);
      req.flash(
        "message",
        "Ocorreu um erro durante o cadastro. Tente novamente mais tarde."
      );
      return res.status(500).render("auth/register");
    }
  }
};
