const { PrismaClient }  = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

/* Creando User */
const createUser = async (req, resp, next) => {

  const { name, email, password } = req.body;
  
  try {

    if(!name || !email || !password) {
      return resp.status(400).json(
        {
          statusCode: 400,
          message: 'Please, complete all the inputs.',
        },
      )
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const oneUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if(oneUser) {
      return resp.status(403).json(
        {
          statusCode: 403,
          message: 'This email already exists.',
        },
      )
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    return resp.json( newUser )

  } catch (error) {
    console.log(error)
    if (error) next(error);
  }
};

// const getConnectedUsers = async (req, resp, next) => {
  
//   try {
//     return resp.json('hola allí');
//   } catch (error) {
//     return next(error);
//   }
// }

module.exports = {
  createUser,
  //getConnectedUsers
}