
import { useParams } from 'react-router-dom';
import FIRDetails from '@/components/fir/FIRDetails';

const UserFIRDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <FIRDetails firId={id || ''} />
    </div>
  );
};

export default UserFIRDetails;
