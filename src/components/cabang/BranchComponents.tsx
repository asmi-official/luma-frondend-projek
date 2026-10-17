export function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <tr key={index} className="border-b border-[#f0f1f5]">
          {Array.from({ length: 7 }, (_, cellIndex) => (
            <td key={cellIndex} className="px-3 py-3">
              <div className="h-2.5 animate-pulse rounded bg-[#f0f2f6]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
