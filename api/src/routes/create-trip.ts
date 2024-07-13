import dayjs from "dayjs";
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from "zod";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/primsa";

dayjs.extend(localizedFormat)
dayjs.locale('pt-br')
export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post('/trips', {
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        emails_to_invite: z.array(z.string().email()).min(1),
        owner_name: z.string().min(4),
        owner_email: z.string().email()
      })
    }
  }, async (request) => {
    const { destination, ends_at, starts_at, emails_to_invite, owner_email, owner_name } = request.body

    if (dayjs(starts_at).isBefore(new Date())) {
      throw new Error('The trip cannot start in the past')
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new Error('The trip cannot end before it starts')
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                email: owner_email,
                name: owner_name,
                is_owner: true,
                is_confirmed: true
              },
              ...emails_to_invite.map(email => ({
                email
              }))
            ]
          }
        }
      }
    })

    const formattedStartDate = dayjs(starts_at).format('LL')
    const formattedEndDate = dayjs(ends_at).format('LL')
    const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`

    const mail = await getMailClient()
    const message = await mail.sendMail({
      from: {
        name: 'Equipe plann.er',
        address: 'oi@plann.er',
      },
      to: {
        name: owner_name,
        address: owner_email
      },
      subject: `Confirme sua viagem para ${destination}`,
      html: `
        <div style="font-family: sans-serif;font-size: 16px;line-height: 1.6;">
          <p >Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso esteja usando o dispositivo móvel, você também pode confirmar a criação da viagem pelos aplicativos:</p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim()
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return {
      tripId: trip.id
    }
  })
}