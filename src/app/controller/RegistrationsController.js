import Meetup from "../models/Meetup";
import Subscription from "../models/Subscription";
import { Op } from 'sequelize';

class MeetupController {
    async index(req, res) {
        const subscriptions = await Subscription.findAll({
            where: {
                user_id: req.userID,
            },
            include: [
                {
                    model: Meetup,
                    where: {
                        date: {
                            [Op.gt]: new Date(),
                        },
                    },
                    required: true,
                },
            ],
            order: [[Meetup, 'date']],
        });

        return res.json(subscriptions);
    }
}

export default new MeetupController();
