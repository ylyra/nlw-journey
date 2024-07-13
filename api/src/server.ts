import cors from '@fastify/cors';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmParticipant } from './routes/confirm-participant';
import { confirmTrip } from './routes/confirm-trip';
import { createTripActivity } from './routes/create-activity';
import { createTripLink } from './routes/create-link';
import { createTrip } from './routes/create-trip';
import { getTripActivities } from './routes/get-activites';
import { getTripLinks } from './routes/get-links';
import { getTripParticipants } from './routes/get-participants';

const app = fastify()

app.register(cors, {
  origin: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createTripActivity)
app.register(getTripActivities)
app.register(createTripLink)
app.register(getTripLinks)
app.register(getTripParticipants)

app.listen({port: 3333}).then(() => {
  console.log('Server is running on port 3333')
})