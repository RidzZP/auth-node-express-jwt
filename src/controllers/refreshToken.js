const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.findAll({
      where: {
        refToken: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REF_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const name = user[0].name;
      const username = user[0].username;
      const accessToken = jwt.sign(
        { userId, name, username },
        process.env.ACCES_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = refreshToken;
