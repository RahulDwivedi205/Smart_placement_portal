import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({ to, className = '', children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>{children || 'Back'}</span>
    </button>
  );
};

export default BackButton;