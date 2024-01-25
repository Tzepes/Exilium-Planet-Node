import { useState } from 'react'
import * as HoverCard from '@radix-ui/react-hover-card';
import {HomeIcon} from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './SurfaceIcon.css'

function SurfaceIcon({lat, lng, IconComponent, parcelType}) {

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <IconComponent className='HoverCardIcon'/>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="HoverCardContent" sideOffset={5}>
            <div className="Text bold"><strong>{parcelType}</strong></div>
            <Text as="p" mb="5" size="3">Latitude: {lat}</Text> 
            <Text as="p" mb="5" size="3">Longitude: {lng}</Text>
          <HoverCard.Arrow />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}

export default SurfaceIcon
