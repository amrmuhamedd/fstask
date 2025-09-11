export default function EmptyRow() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
        <p className="text-gray-500">No orders found</p>
      </td>
    </tr>
  );
}
