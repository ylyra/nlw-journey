import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { prisma } from "../lib/primsa";

export async function createTripLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post('/trips/:tripId/links', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      }),
      body: z.object({
        title: z.string().min(4),
        url: z.string().url()
      })
    }
  }, async (request) => {
    const { url, title } = request.body
    const {tripId} = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    })
    
    if (!trip) {
      throw new ClientError('Trip not found')
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id: tripId
      }
    })

    return {
     linkId: link.id 
    }
  })
}