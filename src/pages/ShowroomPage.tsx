import { Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShowroomScene = lazy(() => import('@/components/3d/ShowroomScene'));

const ShowroomPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-background">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">3D Showroom</h3>
        <p className="text-sm text-muted-foreground">
          Click on hotspots to explore different fabric categories. Use mouse to rotate and zoom.
        </p>
      </div>

      {/* 3D Scene */}
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading 3D Showroom...</p>
            </div>
          </div>
        }
      >
        <ShowroomScene />
      </Suspense>
    </div>
  );
};

export default ShowroomPage;
