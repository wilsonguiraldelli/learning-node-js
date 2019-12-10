import * as yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = yup.object().shape({
      date: yup.date().required(),
      provider_id: yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, provider_id } = req.body;

    // Verificando se provider_id é um usuario provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // parse iso converte a data para o padrão javascrip
    // startOfHour pega apenas a hora, removendo os minutos
    const hourStart = startOfHour(parseISO(date));

    // Verificando se data é passada
    if (isBefore(hourStart, new Date())) {
      res.status(400).json({ error: 'Past dates are not allowed' });
    }

    // Verificando se provider ja possui horario na data da requisicaoo
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      res
        .status(400)
        .json({ error: 'It already has an appointment at this date' });
    }

    if (!isProvider) {
      return res.status(401).json({ error: 'This user is not a provider' });
    }

    const appointment = await Appointment.create({
      user_id: req.id,
      provider_id,
      date: hourStart,
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
