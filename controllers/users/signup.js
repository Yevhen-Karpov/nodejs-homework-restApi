const { User } = require("../../models");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }

  const avatarURL = gravatar.url(email, { s: 250 }, true);
  const newUser = new User({ email, password, avatarURL });

  newUser.setPassword(password);
  newUser.save();

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        password,
        avatarURL,
      },
    },
  });
};

module.exports = signup;
