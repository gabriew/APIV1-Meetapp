import User from '../models/User';
import Meetup from "../models/Meetup";
import Subscription from "../models/Subscription";
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt';

class SubscriptionController {
    async store(req, res) {
        const user = await User.findByPk(req.userID);
        const meetup = await Meetup.findByPk(req.params.meetupId, {
            include: [User]
        });
        if (meetup.user_id === req.userID) {
            return res.status(400).json({ error: "Can't subscribe to you own meetups" });
        }
        if (meetup.past) {
            return res.status(400).json({ error: "Can't subscribe to past meetups" });
        }
        const checkDate = await Subscription.findOne({
            where: {
                user_id: user.id,
            },
            include: [
                {
                    model: Meetup,
                    required: true,
                    where: {
                        date: meetup.date,
                    },
                },
            ],
        });
        if (checkDate) {
            return res.status(400).json({ error: "Can't subscribe to two meetups at the same time" });
        }
        const subscription = await Subscription.create({
            user_id: user.id,
            meetup_id: meetup.id,
        });
        //send mail
        const formattedDate = format(meetup.date,
            "'dia' dd 'de' MMMM', às ' H:mm'h'",
            { locale: pt }
        )
        await Queue.add(SubscriptionMail.key, {
            meetup,
            formattedDate,
            name: user.name,
        })

        return res.json(subscription);
    }
}

export default new SubscriptionController();
