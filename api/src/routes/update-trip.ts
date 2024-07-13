import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/primsa";

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .patch('/trips/:tripId', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      }),
      body: z.object({
        destination: z.string().min(4).optional(),
        starts_at: z.coerce.date().optional(),
        ends_at: z.coerce.date().optional(),
      })
    }
  }, async (request) => {
    const { tripId } = request.params
    const { destination, ends_at, starts_at } = request.body

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    })
    
    if (!trip) {
      throw new ClientError('Trip not found')
    }

    if (starts_at && dayjs(starts_at).isBefore(new Date())) {
      throw new ClientError('The trip cannot start in the past')
    }

    if (ends_at && dayjs(ends_at).isBefore(starts_at)) {
      throw new ClientError('The trip cannot end before it starts')
    }

    await prisma.trip.update({
      where: {
        id: tripId
      },
      data: {
        ...(destination && { destination }),
        ...(starts_at && { starts_at }),
        ...(ends_at && { ends_at }),
      }
    })

    return {
      tripId: trip.id
    }
  })
}