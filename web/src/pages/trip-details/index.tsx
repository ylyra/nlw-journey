import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Trip } from '../../@types/trip'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'
import { Activities } from './activities'
import { CreateActivityModal } from './create-activity-modal'
import { DestinationAndDateHeader } from './destination-and-date-header'
import { Guests } from './guests'
import { ImportantLinks } from './important-links'

export function TripDetailsPage() {
  const params = useParams<{
    tripId: string
  }>()
  const [trip, setTrip] = useState<Trip | null>(null)

  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false)

  const openCreateActivityModal = () => {
    setIsCreateActivityModalOpen(true)
  }

  const closeCreateActivityModal = () => {
    setIsCreateActivityModalOpen(false)
  }

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await api.get<{
          trip: Trip
        }>(`/trips/${params.tripId}`)

        setTrip(response.data.trip)
      } catch (error) {}
    }

    loadTrip()
  }, [params.tripId])

  if (!trip) {
    return null
  }

  return (
    <section className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader trip={trip} />

      <main className="px-4 flex gap-16">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold">Atividades</h1>

            <Button type="button" onClick={openCreateActivityModal}>
              <Plus className="size-5" />
              Cadastrar atividade
            </Button>
          </div>

          <Activities />
        </div>

        <div className="max-w-80 flex-1 space-y-6">
          <ImportantLinks />

          <div className="h-px bg-zinc-800" />

          <Guests />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}
    </section>
  )
}
