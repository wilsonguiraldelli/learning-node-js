import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class SchaduleController {
  async index(req, res) {
    const checkuserProvider = await User.findOne({
      where: { id: req.id, provider: true },
    });

    if (!checkuserProvider) {
      return res.status(401).json({ mensages: 'Not a provider user' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.id,
        canceled_at: null,
        date: {
          // usando o operador do sequelize para utilizar o oparador between
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new SchaduleController();
