export default function LoadingRow() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading orders...</span>
        </div>
      </td>
    </tr>
  );
}
