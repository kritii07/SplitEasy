export default function BillDetails({ friend }) {
  return (
    <div>
      <h3 className="heading">Bill Details of {friend.name}</h3>
      <ul>
        {friend.billDetails.map((bill) => (
          <li key={bill.friendId}>
            Need to pay {bill.price} to {bill.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
