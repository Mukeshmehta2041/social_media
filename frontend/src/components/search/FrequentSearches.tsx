
interface FrequentSearchesProps {
  onSearchClick?: (term: string) => void;
}

const FrequentSearches = ({ onSearchClick }: FrequentSearchesProps) => {
  // Common search terms - can be made dynamic later
  const frequentSearches = [
    'Bdsm',
    'XNXX',
    'XXX Sexy Video',
    'Massage',
    'Independent',
    'VIP',
    'College Girls',
    'Russian',
    'Housewife',
    'MILF',
  ];

  const handleClick = (term: string) => {
    if (onSearchClick) {
      onSearchClick(term);
    } else {
      // Navigate to search page with the term
      window.location.href = `/search?q=${encodeURIComponent(term)}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Frequent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {frequentSearches.map((term, index) => (
          <button
            key={index}
            onClick={() => handleClick(term)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-600 rounded-full transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrequentSearches;

