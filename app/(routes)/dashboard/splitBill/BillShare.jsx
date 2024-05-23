import { useState } from 'react';
import Button from './Button';

export default function BillShare({ friends, onBillPaid }) {
  const [bill, setBill] = useState('');
  const [friend, setFriend] = useState('');

  function submitBill(event) {
    event.preventDefault();
    const singleFriend = friends.find((fr) => +friend === +fr.id);
    const billDetails = { friendId: friend, name: singleFriend.name, bill };
    onBillPaid(billDetails);
  }
  return (
    <div>
      <h3 className='heading'>Share Bill Details</h3>
      <form onSubmit={submitBill}>
        <div>
          <label className='sub-heading'>Select Friend Who paid the bill</label>
          <select className='box' value={friend} onChange={(e) => setFriend(e.target.value)}>
            <option value="">Select Friend</option>
            {friends.map((friend) => (
              <option value={friend.id} key={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='sub-heading'>Bill Amount</label>
          <input className='box' placeholder='Enter Bill  Amount' type="text" value={bill} onChange={(e) => setBill(e.target.value)} />
        </div>

        <div>
          <Button>Add Bill</Button>
        </div>
      </form>
    </div>
  );
}
