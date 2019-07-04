require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server');
const { UserModel, CatModel } = require('./models/Model.js');
const { createToken } = require('./actions/authActions.js')
const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server-express');

const { UserSchema, CatSchema } = require('./schema/Schema.js');

const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

mongoose.connect(
  process.env.URL_DATABASE,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  }
);

const mongo = mongoose.connection;

mongo.on('error', console.error.bind(console, 'Error de conexion'));
mongo.on('open', () => console.log('Conectado'));

// ________________________________ PREVIOUS ________________________________
/*
const cat = [
  {
    color: 'Negro',
    size: 'Grande',
    gender: 'Masculino',
    age: '1',
    name: 'Zeus',
  },
  {
    color: 'Negro',
    size: 'Mediano',
    gender: 'Masculino',
    age: '1',
    name: 'Apolita',
  },
  {
    color: 'Negro',
    size: 'Grande',
    gender: 'Femenino',
    age: '1',
    name: 'Artemisa',
  },
  {
    color: 'Negro',
    size: 'Pequeño',
    gender: 'Femenino',
    age: '1',
    name: 'Minerva',
  },
  {
    color: 'Negro',
    size: 'Pequeño',
    gender: 'Femenino',
    age: '1',
    name: 'Venus',
  },
  {
    color: 'Negro',
    size: 'Pequeño',
    gender: 'Femenino',
    age: '1',
    name: 'Geminis',
  },
  {
    color: 'Negro',
    size: 'Pequeño',
    gender: 'Masculino',
    age: '1',
    name: 'Hades',
  },
];

const user = [
  {
    username: 'Xhiomi',
    password: 'password123_JAJA_SUPER_SEGURO',
    gender: 'Femenino',
    age: '25',
    country: 'Mexico',
    state: 'Mexico city',
  },
  {
    username: 'Angel',
    password: 'Angel_password',
    gender: 'Masculino',
    age: '30',
    country: 'Mexico',
    state: 'Mexico city',
  },
  {
    username: 'Omar',
    password: 'Omar_password',
    gender: 'Masculino',
    age: '28',
    country: 'Mexico',
    state: 'Mexico city',
  },
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Gatitos" type can be used in other type declarations.
  type Cats {
    color: String
    size: String
    gender: String
    age: String
    name: String
  }

  type Users {
    username: String
    password: String
    gender: String
    age: String
    country: String
    state: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    cat: [Cats]
    user: [Users]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve gatitos from the "gatitos" array above.
const resolvers = {
  Query: {
    cat: () => cat,
    user: () => user,
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  ¡Generando gatitos en ${url}!`);
});*/

//________________________________ PREVIOUS ________________________________

//Signo de interrogación hace al campo obligatorio
const typeDefs = gql`
directive @AuthDirective on QUERY | FIELD_DEFINITION | FIELD
  type Query {
    userName: Auth
    msgWait: String @AuthDirective
    msgPublic: String
    cat: [cat]
    user: [user]
  }

  type Auth{
    msg: String
    token: String
  }

  input UserInput {
    userName: String!
    email: String!
    password: String!
    gender: String
    age: String
    country: String
    state: String
  }

  input CatsInput {
    color: String
    size: String
    gender: String
    age: String
    name: String
  }

  type Mutation {
    signup(data: UserInput): Auth
    login(email: String!, password: String): Auth
    update(data: CatsInput): Auth
    request(color: String, size: String, gender: String, age: String, name: String): Auth
  }

  type cat {
    color: String
    size: String
    gender: String
    age: String
    name: String
  }

  type user {
    username: String
    password: String
    gender: String
    age: String
    country: String
    state: String
  }
`;

//signup(parent, args, context, info)
//parent  ---
//args    --- datos que se mandan desde las queries
//context --- información que se comparte a través de los resolvers
//info    ---

const resolvers = {
  Query: {
    cat: () => CatModel,
    user: () => UserModel,
    userName: () => {return {msg: 'user'}},
    msgWait: () => {return 'Este es un mensaje con un usuario autenticado'},
    msgPublic: () => {return 'Este es un mensaje para todo publico'},
  },

  Mutation: {
    signup: (parent, args, context, info) => {
      return UserModel.create({...args.data}).then(() => {
        return { msg: `Se ha registrado el usuario ${args.data.userName}`}
      }).catch(err => {
        return { msg: `No se pudo registrar al usuario ${args.data.userName}`}
        //return { msg: `${err}`}
      })
    },
    /*login: (parent, args, context, info) => {
      const loginAction = new Promise((resolve, reject) => {
      UserModel.findOne({email: args.data.email}).then(user => {
        bcrypt.compare(
            args.data.password, (error, isValid) => {
            if(error) reject({token: '', msg: `${error}`});
              isValid
                ? resolve({token: createToken(user), msg: `Se ha generado token`})
                : reject({token: '', msg: `Password doesn't match`});
          },
          user.password
        )
        })
      });

      loginAction().then(auth => {
        return Auth;
      }).catch(error => {
        return {
          token: '',
          msg: error
        }
      })
    }*/

    login: (parent, args, context, info) => {
      return loginAction({ email: args.email, password: args.password }).then(Auth => {
        console.log('auth', Auth)
        return Auth;
      }).catch(error => {
        console.log('ERROR', error)
        return error
      })
    },

    update: (parent, args, context, info) => {
      return CatModel.create({...args.data}).then(() => {
        return { msg: `Se ha registrado el gatito ${args.data.name}`}
      }).catch(err => {
        return { msg: `No se pudo registrar al gatito ${args.data.name} debido a ${err}`}
        //return { msg: `${err}`}
      })
    },

    /*request: (parent, args, context, info) => {
      return updateCats({ color: args.color, size: args.size, gender: args.gender, age: args.age, name: args.name })
      .then(() => {
        return '1'
        console.log('Se encontró información')
      }).catch(error => {
        console.log('ERROR', error)
        return error
      })
    }*/

    request: (parent, args, context, info) => {
      return loginAction({ color: args.color, size: args.size, gender: args.gender, age: args.age, name: args.name }).then(Auth => {
        console.log('auth', Auth)
        return Auth;
      }).catch(error => {
        console.log('ERROR', error)
        return error
      })
    }
  }
}

const requestCat = (data) => {
  console.log('Cat', data)
  return new Promise((resolve, reject) => {
    UserModel.findOne({ color: data.color })
    .then(cat => {
      console.log('Comparación de contraseñas', cat.color, data.color)

      if(data.color == cat.color){
        resolve({ msg: `Se encontró un gatito.` })
      } else {
        reject({ msg: `No se lograron encontrar gatitos.` });
      }
    })
  });
}

/*const requestCat = (parameter, data) => {
  return new Promise((resolve, reject) => {
    CatModel
    .value({ parameter: data.parameter })
    .then(cat => {
      return {...req, user}
      console.log('error', cat.color, cat.size, cat.gender, cat.age, cat.name)
    })
    .catch(err)
  })
};*/

const loginAction = (data) => {
  console.log('Usuario', data)
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: data.email }).then(user => {
      console.log('Comparación de contraseñas', user.password, data.password)

      bcrypt.compare(
        data.password,
        user.password,
        (err, isValid) => {
          if (err) reject(err);
          isValid
            ? resolve({ token: createToken(user), msg: `Se ha logueado correctamente.` })
            : reject({ token: '', msg: `Credenciales inválidas. Verifique su usuario y contraseña.` });
        })
    })
  });
}

const getContext = (req) => {
  const token = req.headers.authorization;
  if(typeof token === typeof undefined) return req;
  return JWT.verify(
    token,
    process.env.SECRET,
    function(err, result) {
      if(err) return req;
      return UserModel.findOne({_id: result.id})
      .then(user => {
        console.log(user);
        return {...req, user}
      });
  });
}

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const {resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args){
      const ctx = args[2];
      if(ctx.user){
        return await resolve.apply(this, args);
      } else{
        throw new AuthenticatioError("Necesitas estar logeado para hacer esto");
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schmaDirectives: {
    AuthDirective: AuthDirective,
  },
  context: async({req}) => getContext(req),
});

server.listen().then(({url}) => {
  console.log(`GATITOS CREANDOSE EN ${url} <3 =(nwn)=`)
});

console.log('CatModel: ', CatModel)
//console.log('CatSchema: ',CatSchema)
//console.log('CatModel.fields: ',CatModel.fields)
// console.log('CatModel.model(cat): ',CatModel.model("cat"))
console.log('CatModel.model("cat", CatSchema): ',CatModel.model("cat", CatSchema))
CatSchema
//console.log('model.fields: ',model.fields)
//console.log(process.env.URL_DATABASE);
