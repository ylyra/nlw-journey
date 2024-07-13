import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
  .get('/trips/:tripId/confirm', {
    schema: {
      params: z.object({
        tripId: z.string().cuid()
      })
    }
  }, async (request) => {
    const tripId = (request.params).tripId
    
    return {
      tripId
    }
  })
}