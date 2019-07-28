import User from '../models/User';
import Meetup from "../models/Meetup";
import Subscription from "../models/Subscription";

class MeetupController {
    async store(req, res) {
        const user = await User.findByPk(req.userID);
        const meetup = await Meetup.findByPk(req.params.meetupId);
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
        return res.json(subscription);
    }
}

export default new MeetupController();
