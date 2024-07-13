import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/primsa";

export async function getTripLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/trips/:tripId/links', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      }),
    }
  }, async (request) => {
    const {tripId} = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        links: true
      }
    })
    
    if (!trip) {
      throw new ClientError('Trip not found')
    }

    return {
      links: trip.links
    }
  })
}