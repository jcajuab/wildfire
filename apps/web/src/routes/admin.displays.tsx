import { createFileRoute } from '@tanstack/react-router'
import { EllipsisIcon, MapPinIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/admin/displays')({
  component: Component,
})

function Component() {
  return (
    <>
      <h1 className='text-4xl font-bold'>Displays</h1>
      <section className='grid flex-1 grid-cols-3 grid-rows-3'>
        <Card>
          <CardHeader>
            <CardTitle>LB446</CardTitle>
            <CardDescription className='flex items-center gap-x-1'>
              <MapPinIcon className='size-3.5' />
              <span>Bunzel Building - 4th Floor</span>
            </CardDescription>
            <CardAction>
              <Button size='icon' variant='ghost'>
                <EllipsisIcon />
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      </section>
    </>
  )
}
