const graphql = require('graphql');
const hash = require('bcrypt').hash;
const secretKey = require('../secret')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLFloat } = graphql;

const User = require('../models/user');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    login: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve( parent, { id } ) {
        return User.findById(id);
      },
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve( parent, { login, password } ) {
        try {
          const existingUser = await User.findOne({ email: login });
          if ( existingUser ) {
            throw new Error('User exists already.');
          }
          const hashedPassword = await hash(password, 12);
          const user = new User({
            login,
            password: hashedPassword,
          });

          const result = await user.save()

          return { login: result.login, password: null };
        } catch (err) {
          throw err;
        }

      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
