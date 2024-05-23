import { useState } from 'react';
import Button from './Button';

export default function AddFriend({ onAddFriend }) {
  const [name, setName] = useState('');

  function addFriend(event) {
    event.preventDefault();
    onAddFriend(name);
    setName('');
  }
  return (
    <div>
      <form onSubmit={addFriend}>
        <h3 className='heading'>Add Friend</h3>
        <div>
          <label className='sub-heading'>Friend Name</label>
          <input className='box' placeholder='Enter Name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <Button>Add Friend</Button>
        </div>
      </form>
    </div>
  );
}
