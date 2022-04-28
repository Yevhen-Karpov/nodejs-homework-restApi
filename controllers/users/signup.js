const { User } = require("../../models");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../../helpers");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict("Email in use");
  }

  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email, { s: 250 }, true);
  const newUser = new User({ email, password, avatarURL, verificationToken });

  newUser.setPassword(password);
  await newUser.save();

  const mail = {
    to: email,
    subject: "Подтверждение email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить email</a>`,
  };
  await sendEmail(mail);
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        password,
        avatarURL,
        verificationToken,
      },
    },
  });
};

module.exports = signup;
