import AppError from '../error/app.error.js';
import Pass from '../models/pass.model.js';

const passController = {
  /**
   * Retrieves all passes.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} - the response object with the data property containing all passes
   */
  async getAllPass(req, res) {
    const getAllPass = await Pass.find();

    return res.status(200).json({ data: getAllPass });
  },

  /**
 * A function that adds a pass.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} Returns the pass record.
 */
  async addPass(req, res) {
    const { passLevel } = req.body;

    const newPass = {
      passLevel,
    };

    const passRecord = new Pass(newPass);
    await passRecord.save();

    return res.status(201).json({ data: passRecord });
  },

  /**
 * Retrieves a specific item from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response containing the retrieved item.
 */
  async getOne(req, res, next) {
    const { id } = req.params;
    const pass = await Pass.findById(id);

    if (!pass) {
      return next(new AppError(404, 'No pass found'));
    }

    return res.status(200).json({ data: pass });
  },

  /**
 * Update a pass.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The updated pass.
 */
  async updatePass(req, res, next) {
    const { id } = req.params;
    req.body.updatedAt = Date.now();
    const oldPass = await Pass.findByIdAndUpdate(id, req.body);

    if (!oldPass) {
      return next(new AppError(404, 'No match found'));
    }

    const updatedPass = await Pass.findById(id);

    return res.status(201).json({ data: updatedPass });
  },

  /**
   * Deletes a pass.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @param {Function} next - The next middleware function
   * @return {Number} The HTTP status code 204
   */
  async deletePass(req, res, next) {
    const { id } = req.params;
    const pass = await Pass.findByIdAndRemove(id, req.body);

    if (!pass) {
      return next(new AppError(404, 'No match found'));
    }

    return res.sendStatus(204);
  },
};

export default passController;
