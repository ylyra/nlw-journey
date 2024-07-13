import cors from '@fastify/cors';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { env } from './env';
import { errorHandler } from './error-handler';
import { confirmParticipant } from './routes/confirm-participant';
import { confirmTrip } from './routes/confirm-trip';
import { createTripActivity } from './routes/create-activity';
import { createTripInvite } from './routes/create-invite';
import { createTripLink } from './routes/create-link';
import { createTrip } from './routes/create-trip';
import { getTripActivities } from './routes/get-activites';
import { getTripLinks } from './routes/get-links';
import { getTripParticipant } from './routes/get-participant';
import { getTripParticipants } from './routes/get-participants';
import { getTripDetails } from './routes/get-trip-details';
import { updateTrip } from './routes/update-trip';

const app = fastify()

app.register(cors, {
  origin: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createTripActivity)
app.register(getTripActivities)
app.register(createTripLink)
app.register(getTripLinks)
app.register(getTripParticipants)
app.register(createTripInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getTripParticipant)

app.listen({ port: env.PORT }).then(() => {
  console.log('Server is running on port 3333')
})