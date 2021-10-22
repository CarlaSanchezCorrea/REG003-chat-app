const config = require('../global/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signIn = async (req, resp, next) => {

  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(400);
  }

  // TO DO: autenticar a la usuarix
  try {
    const emailUser = await prisma.user.findUnique({
      where: {
        email
      },
    })

    if (!emailUser) {
      return resp.status(404).json({
        message: 'This user does not exist!',
      });
    }

    const validPassword = await bcrypt.compare(password, emailUser.password);
    if (!validPassword) return resp.status(400).json({ message: 'Invalid Password.' });

    // Create a new token with email in the payload
    jwt.sign(
      {
        id: emailUser.id,
        email: emailUser.email,
        name: emailUser.name
      },
      config.secret,
      {
        algorithm: 'HS256',
        expiresIn: '365d',
      },
      (err, token) => {
        if (err) resp.next(err);
        return resp.json({ token });
      }
    );
    console.log('Bienvenido al chat principal')
  } catch (error) {
      return next(error);
  }

}

module.exports = {
  signIn
}
