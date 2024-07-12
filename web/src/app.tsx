import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const CreateTripPage = lazy(() =>
  import('./pages/create-trip').then((module) => ({
    default: module.CreateTripPage,
  })),
)

const TripDetailsPage = lazy(() =>
  import('./pages/trip-details').then((module) => ({
    default: module.TripDetailsPage,
  })),
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <CreateTripPage />,
  },
  {
    path: '/trips/:tripId',
    element: <TripDetailsPage />,
  },
])

export function App() {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  )
}
