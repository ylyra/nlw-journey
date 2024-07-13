import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from "zod";
import { env } from "../env";
import { ClientError } from "../errors/client-error";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/primsa";

export async function createTripInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post('/trips/:tripId/invites', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      }),
      body: z.object({
        email: z.string().email()
      })
    }
  }, async (request) => {
    const { email } = request.body
    const {tripId} = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        participants: {
          where: {
            email
          }
        }
      }
    })
    
    if (!trip) {
      throw new ClientError('Trip not found')
    }

    const isParticipant = trip.participants.length > 0
    if (isParticipant) {
      throw new ClientError('Organizer cannot invite themselves')
    }

    const participant = await prisma.participant.create({
      data: {
        email,
        trip_id: tripId
      }
    })

    const formattedStartDate = dayjs(trip.starts_at).format('LL')
    const formattedEndDate = dayjs(trip.ends_at).format('LL')

    const mail = await getMailClient()

    const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`


    const message = await mail.sendMail({
      from: {
        name: 'Equipe plann.er',
        address: 'oi@plann.er',
      },
      to: participant.email,
      subject: `Confirme sua presença na viagem para ${trip.destination}`,
      html: `
        <div style="font-family: sans-serif;font-size: 16px;line-height: 1.6;">
          <p >Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate} até ${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar presença</a>
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
      participantId: participant.id
    }
  })
}