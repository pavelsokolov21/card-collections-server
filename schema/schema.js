const graphql = require( 'graphql' );

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLFloat } = graphql;

const User = require( '../models/user' );

const UserType = new GraphQLObjectType( {
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    login: { type: GraphQLString },
    password: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
} );

const Query = new GraphQLObjectType( {
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve( parent, { id } ) {
        return User.findById( id );
      },
    },
  }
} );

const Mutation = new GraphQLObjectType( {
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve( parent, { login, password, name } ) {
        const user = new User( {
          login,
          password,
          name
        } );
        return user.save();
      }
    }
  })
} )

module.exports = new GraphQLSchema( {
  query: Query,
  mutation: Mutation
} );
