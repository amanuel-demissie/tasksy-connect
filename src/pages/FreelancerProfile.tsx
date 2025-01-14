import { useParams } from 'react-router-dom';

const FreelancerProfile = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Freelancer Profile</h1>
      <p>Profile ID: {id}</p>
      {/* Add more profile details here */}
    </div>
  );
};

export default FreelancerProfile;