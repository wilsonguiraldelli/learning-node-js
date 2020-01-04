import * as yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointment = await Appointment.findAll({
      where: {
        user_id: req.id,
        canceled_at: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      order: ['date'],
      // incluindo relacionamentos
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              // propriedade path é obrigada a ser retornada por fazer parte da url
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.status(200).json(appointment);
  }

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

    /*
      Notify appointment provider
    */

    const user = await User.findByPk(req.id);
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás ' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment.user_id !== req.id) {
      return res.status(401).json({
        error: 'You don`t habe permission to cancel this appointment',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel an appoint 2 hours before it`s time ',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    res.json(appointment);
  }
}

export default new AppointmentController();
