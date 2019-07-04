const { ApolloServer, gql } = require('apollo-server');

/*const EasyGraphQLTester = require('easygraphql-tester')
const fs = require('fs')
const path = require('path')

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')*/

// This is a (sample) collection of gatitos we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
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
});
