import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/primsa";

export async function getTripParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/participants/:participantId', {
    schema: {
      params: z.object({
        participantId: z.string().cuid()
      }),
    }
  }, async (request) => {
    const { participantId } = request.params

    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_confirmed: true,
      }
    })
    
    if (!participant) {
      throw new ClientError('Participant not found')
    }

    return {
      participant: participant
    }
  })
}