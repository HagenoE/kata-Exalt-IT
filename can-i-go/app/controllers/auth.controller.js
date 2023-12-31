import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../error/app.error.js';
import sendEmail from '../utils/email.utils.js';
import Pass from '../models/pass.model.js';

/**
 * Generates a token using the provided id.
 *
 * @param {number} id - The id used to generate the token.
 * @return {string} The generated token.
 */
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

/**
 * Generates a token for the user and stores the user data in a cookie.
 *
 * @param {Object} user - The user object.
 * @param {Object} res - The response object.
 * @param {number} statusCode - The status code to be returned by the response.
 * @return {Object} The response object containing the user token and user data.
 */
const generateTokenAndStoreUser = (user, res, statusCode) => {
  // eslint-disable-next-line no-underscore-dangle
  const userToken = generateToken(user._id);

  const userData = user;

  const cookie = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookie.secure = true;
  }

  userData.password = null;

  res.cookie('jwt', userToken);

  return res.status(statusCode).json(
    {
      userToken,
      data:
        { user: userData },
    },
  );
};

/**
 * Retrieves information from a token.
 *
 * @param {object} req - the request object
 * @param {function} next - the next middleware function
 * @return {object} the decoded token information
 */
export const getTokenInformation = (req, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const header = req.headers.authorization.split(' ');
    [, token] = header;
  }
  if (!token) {
    return next(new AppError(401, 'You are not logged'));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  return decode;
};

const authController = {

  /**
   * Sign up a new user.
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {Promise<object>} the newly created user
   */
  signUp: async (req, res) => {
    const newUser = await User.create(req.body);
    return generateTokenAndStoreUser(newUser, res, 201);
  },

  /**
   * Authenticates the user by checking the email and password provided in the request body.
   * If the email or password is missing, it returns an error with status code 400.
   * If the email or password is incorrect, it returns an error with status code 401.
   * If the authentication is successful, it generates a token and stores the user in the response.
   *
   * @param {Object} req - The request object containing the user's email and password in the body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function to be called in the middleware chain.
   * @return {Promise} A promise that resolves to the generated token and the response object.
   */
  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, 'Email and password is required'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError(401, 'Email or Password are not correct'));
    }

    return generateTokenAndStoreUser(user, res, 200);
  },

  /**
   * Sends a password reset email to the user.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @param {Function} next - the next middleware function
   * @return {Object} the response object with status and message
   */
  forgotPassword: async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError(404, 'No user found'));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `If you forgot your mail, please follow this link ${resetURL}.\nIf is not, please to don't care of this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Regenarated password link (for 10 min)',
        message,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Token send',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();
      return next(new AppError(500, 'Send email in error. Try later'));
    }
  },

  /**
   * Resets the password for a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next function.
   * @return {Promise} A promise that resolves with the updated user or rejects with an error.
   */
  resetPassword: async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // eslint-disable-next-line max-len
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
      return next(new AppError(400, 'Wrong link. Try to reasking a reset link'));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    try {
      await user.save();

      return generateTokenAndStoreUser(user, 201, res);
    } catch (error) {
      return next(new AppError(400, error.message));
    }
  },

  /**
   * Updates the user's password.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @return {Promise} A promise that resolves with the updated user token and status code.
   */
  updatePassword: async (req, res, next) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    const currentUser = await User.findById(req.user.id).select('+password');

    const isCorrect = await currentUser.correctPassword(currentPassword, currentUser.password);

    if (!isCorrect) {
      return next(new AppError(401, 'Wrong password'));
    }
    currentUser.password = newPassword;
    currentUser.passwordConfirm = newPasswordConfirm;
    await currentUser.save();

    return generateTokenAndStoreUser(currentUser, 201, res);
  },

  /**
   * Middleware function to check if a user is logged in.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Function} The next middleware function.
   */
  isLogged: async (req, res, next) => {
    const decode = getTokenInformation(req, next);
    const currentUser = await User.findById(decode.id);
    if (!currentUser) return next(new AppError(401, 'Current user does not exist'));

    if (currentUser.changePasswordAfter(decode.iat)) {
      return next(new AppError(401, 'New password generate. Please login again'));
    }

    req.user = currentUser;
    return next();
  },

  /**
   * Checks if the user making the request is an admin.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {void}
   */
  isAdmin: async (req, res, next) => {
    const decode = getTokenInformation(req, next);

    if (!decode) {
      return next(new AppError(401, 'You are not logged'));
    }

    const currentUser = await User.findById(decode.id);
    if (!currentUser) return next(new AppError(401, 'Current user does not exist'));

    if (currentUser.role !== 'admin') {
      return next(new AppError(403, 'You can not access'));
    }

    return next();
  },

  /**
   * Middleware function to check if the current user is the owner of the resource.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @return {Function} The next middleware function.
   */
  isOwner: async (req, res, next) => {
    const decode = getTokenInformation(req, next);
    let data;
    const [, model] = req.originalUrl.trim().split('/');

    if (!decode) {
      return next(new AppError(401, 'You are not logged'));
    }

    const currentUser = await User.findById(decode.id);
    if (!currentUser) return next(new AppError(401, 'Current user is not exist'));

    switch (model) {
      case 'user':
        data = await User.findById(decode.id);
        if ((currentUser.id !== data.id)) {
          return next(new AppError(401, 'Current user is not the owner'));
        }
        break;
      case 'pass':
        data = await Pass.findById(decode.passLevelId);
        if ((currentUser.id !== data.ownerId)) {
          return next(new AppError(401, 'Current user is not the owner'));
        }
        break;
      default:
        break;
    }
    return next();
  },
};

export default authController;
