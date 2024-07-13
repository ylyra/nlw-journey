import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../errors/client-error";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/primsa";

export async function getTripActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/trips/:tripId/activities', {
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
        activities: {
          orderBy: {
            occurs_at: 'asc'
          }
        }
      }
    })
    
    if (!trip) {
      throw new ClientError('Trip not found')
    }

    const diffrenceInDaysBetweenStartAndEnd = dayjs(trip.ends_at).diff(dayjs(trip.starts_at), 'days')

    const activities = Array.from({ length: diffrenceInDaysBetweenStartAndEnd + 1 }, (_, index) => {
      const date = dayjs(trip.starts_at).add(index, 'days')

      const activitiesForDate = trip.activities.filter(activity => dayjs(activity.occurs_at).isSame(date, 'day'))

      return {
        date: date.toDate(),
        activities: activitiesForDate
      }
    })
    
    return {
      activities
    }
  })
}