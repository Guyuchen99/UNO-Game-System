const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("login", {
        message: "Please enter a username and password.",
      });
    }

    if (username !== process.env.LOGIN_USERNAME || password !== process.env.LOGIN_PASSWORD) {
      return res.status(401).render("login", {
        message: "Your username or password is incorrect.",
      });
    } else {
      const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("myCookie", token, cookieOptions);
      res.status(200).redirect("/dashboard");
    }
  } catch (error) {
    console.log("OH NO! Error occured in authController.login: " + error);
  }
};

exports.logout = async (req, res) => {
  res.cookie("myCookie", "logout", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });

  setTimeout(() => {
    res.status(200).redirect("/login");
  }, 1000);
};

// Middleware
exports.isLoggedIn = (req, res, next) => {
  if (req.cookies.myCookie) {
    req.loginStatus = true;
    return next();
  } else {
    req.loginStatus = false;
    return next();
  }
};
