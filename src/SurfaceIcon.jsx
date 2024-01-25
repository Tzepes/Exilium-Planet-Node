import { useState } from 'react'
import * as HoverCard from '@radix-ui/react-hover-card';
import {HomeIcon} from '@radix-ui/react-icons'
import { Text } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './SurfaceIcon.css'

function SurfaceIcon({location}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <HomeIcon className='HoverCardIcon'/>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content className="HoverCardContent" sideOffset={5}>
            <div className="Text bold"><strong>Owned Parcel</strong></div>
            <Text as="p" mb="5" size="3">Latitude: </Text> 
            <Text as="p" mb="5" size="3">Longitude: </Text>
          <HoverCard.Arrow />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  )
}

export default SurfaceIcon
