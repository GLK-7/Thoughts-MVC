const User = require("../models/User"); // Importa o modelo de usuário
const bcrypt = require("bcryptjs"); // Importa o bcrypt para hash de senhas

module.exports = class AuthController {
  // Renderiza a página de login
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuário não encontrado!"); // Mensagem de erro via flash
      res.render("auth/login");

      return;
    }

    //check if passwords match
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha incorreta!"); // Mensagem de erro via flash
      res.render("auth/login");

      return;
    }

    //inicia e salva a sessão. Em seguida, redireciona o usuário
    req.session.userid = user.id;
    req.flash("message", "Login realizado com sucesso!"); // Mensagem de sucesso

    req.session.save(() => {
      return res.status(201).redirect("/"); // Redireciona para a página principal
    });
  }

  // Renderiza a página de registro
  static register(req, res) {
    res.render("auth/register");
  }

  // Lida com o envio do formulário de registro
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body; // Extrai os dados do formulário

    // Validação para garantir que as senhas correspondem
    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem, tente novamente!"); // Mensagem de erro via flash
      return res.status(400).render("auth/register"); // Retorna a página de registro com status 400
    }

    try {
      // Verifica se o usuário já existe no banco de dados pelo e-mail
      const checkIfUserExists = await User.findOne({ where: { email: email } });

      // Se o e-mail já estiver em uso, retorna um erro
      if (checkIfUserExists) {
        req.flash("message", "O e-mail já está sendo utilizado!"); // Mensagem de erro via flash
        return res.status(400).render("auth/register");
      }

      // Criação da senha criptografada
      const salt = bcrypt.genSaltSync(10); // Gera o salt para o hash da senha
      const hashedPassword = bcrypt.hashSync(password, salt); // Cria o hash da senha

      // Criação do objeto usuário
      const user = {
        name,
        email,
        password: hashedPassword, // Salva a senha criptografada no banco de dados
      };

      // Salva o usuário no banco de dados
      const createdUser = await User.create(user);

      // Inicializa a sessão do usuário
      req.session.userid = createdUser.id; // Usa o ID do usuário criado para a sessão

      // Salva a sessão e, em seguida, redireciona o usuário
      req.session.save(() => {
        req.flash("message", "Cadastro realizado com sucesso!"); // Mensagem de sucesso
        return res.status(201).redirect("/"); // Redireciona para a página principal
      });
    } catch (error) {
      // Captura e trata erros no processo de registro
      console.error(error); // Loga o erro no console
      req.flash(
        "message",
        "Ocorreu um erro durante o cadastro. Tente novamente mais tarde."
      );
      return res.status(500).render("auth/register"); // Retorna a página de registro com status 500
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
