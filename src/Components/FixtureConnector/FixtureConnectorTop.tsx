type Props = {
  highlight?: boolean; // winner path
};

const BracketConnector = ({ highlight = false }: Props) => {
  const color = highlight ? "bg-green-500" : "bg-neutral-900";

  return (
    <div className="relative w-12 h-20 right-8">
      {/* top horizontal */}
      <div className={`absolute top-0 left-0 w-16 h-[2px] bg-gray-200`} />

      {/* bottom horizontal */}
      <div className={`absolute bottom-0 left-0 w-16 h-[2px] bg-gray-200`} />

      {/* vertical */}
      <div className={`absolute left-16 top-0 h-full w-[2px] bg-gray-200`} />

      {/* right horizontal (to winner) */}
      <div className={`absolute left-16 top-1/2 w-16 h-[2px] bg-gray-200`} />
    </div>
  );
};

export default BracketConnector;
