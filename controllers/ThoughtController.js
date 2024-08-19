const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showThoughts(req, res) {
    res.render("thoughts/home");
  }

  static async dashboard(req, res) {
    res.render("thoughts/dashboard");
  }
};
