import { Button, Card } from '../components';

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Payment Intelligence
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          A production-ready React application with Redux Toolkit and Tailwind CSS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hover>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">React 18</h3>
          <p className="text-gray-600 mb-4">
            Modern React with hooks and functional components
          </p>
          <Button variant="primary" size="sm">Learn More</Button>
        </Card>

        <Card hover>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Redux Toolkit</h3>
          <p className="text-gray-600 mb-4">
            Efficient state management with modern Redux patterns
          </p>
          <Button variant="primary" size="sm">Learn More</Button>
        </Card>

        <Card hover>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
          <p className="text-gray-600 mb-4">
            Utility-first CSS framework for rapid UI development
          </p>
          <Button variant="primary" size="sm">Learn More</Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
