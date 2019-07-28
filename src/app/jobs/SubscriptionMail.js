import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }
    async handle({ data }) {
        const { meetup, formattedDate, name } = data;
        await Mail.sendMail({
            to: `${meetup.User.name} <${meetup.User.email}>`,
            subject: 'Nova inscrição!',
            template: 'cancellation',
            context: {
                user: meetup.User.name,
                registered: name,
                meetapp: `${meetup.title} | ${formattedDate}`,
            }
        });
    }
}
export default new SubscriptionMail();