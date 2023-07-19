const User = require("../models/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ageOfToken = 24 * 60 * 60;

const errorCatch = (err) => {
  if (err.code == 11000) {
    return { error: "Email Already Exists" };
  }
};

const newToken = (id) => {
  return jwt.sign({ id }, "secret key", { expiresIn: ageOfToken });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = newToken(user._id);

    res.cookie("jwt", token, {
      withCredential: true,
      httpOnly: false,
      maxAge: ageOfToken * 1000,
    });

    res.status(200).json({ user: user._id });
  } catch (error) {
    console.log(errorCatch(error));
    res.status(400).json(errorCatch(error));
  }
};
exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      console.log(auth);
      if (auth) {
        const token = newToken(user._id);
        res.cookie("jwt", token, {
          withCredential: true,
          httpOnly: false,
          maxAge: ageOfToken * 1000,
        });
        res.status(200).json({ user: user._id });
      } else {
        res.status(400).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(400).json({ error: "Incorrect Email" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Something went wrong" });
  }
};
