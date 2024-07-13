import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/primsa";

export async function createTripActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .post('/trips/:tripId/activities', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      }),
      body: z.object({
        title: z.string().min(4),
        occurs_at: z.coerce.date(),
      })
    }
  }, async (request) => {
    const { occurs_at, title } = request.body
    const {tripId} = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    })
    
    if (!trip) {
      throw new Error('Trip not found')
    }

    if (
      dayjs(occurs_at).isBefore(trip.starts_at)
    ) {
      throw new Error('The activity cannot occur in the past')
    }

    if (
      dayjs(occurs_at).isAfter(trip.ends_at)
    ) {
      throw new Error('The activity cannot occur after the trip ends')
    }
    
    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id: tripId
      }
    })

    return {
     activityId: activity.id 
    }
  })
}