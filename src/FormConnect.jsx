import React, {useState} from 'react';
import * as Form from '@radix-ui/react-form';
import './Form.css';

import {handleUsernameSubmit} from './utils/apis';
import { set } from 'mongoose';

function FormConnect ({wallet, setUser, setParcel, setOwnsParcel}) {
  const [submit, setSubmit] = useState(false);

  async function fetchUser(event) {
    await handleUsernameSubmit(event, event.target[0].value, wallet, setUser, setParcel, setOwnsParcel);
  }

  return(
    <>
      <Form.Root className="FormRoot" 
              onSubmit={(event) => {
                setSubmit(true);
                fetchUser(event);
                setSubmit(true);
              }}>
        <Form.Field className="FormField" name="name">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">User Name</Form.Label>
            <Form.Message className="FormMessage" match="badInput">
              This user name is taken
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }}>
            {submit ? 'Submitting...' : 'Submit'}
          </button>
        </Form.Submit>
      </Form.Root>
    </>
  )
};

export default FormConnect;