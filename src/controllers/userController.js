const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "username"],
    });
    res.json({ users });
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      username: username,
      password: hashPassword,
    });
    res.json({
      message: `Register Sukses ${username}`,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.json({ message: "Wrong Password" });

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
    const refreshToken = jwt.sign(
      { userId, name, username },
      process.env.REF_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      {
        refToken: refreshToken,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.json({ message: "User Tidak Ditemukan" });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refToken: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    {
      refToken: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

module.exports = {
  getAllUser,
  register,
  login,
  logout,
};
