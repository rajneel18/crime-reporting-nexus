
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockFIRs } from '@/utils/mockData';
import { useAuthStore } from '@/utils/auth';
import { FIR } from '@/types';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const [userFIRs, setUserFIRs] = useState<FIR[]>([]);
  
  useEffect(() => {
    // Filter FIRs to show only those created by current user
    if (user) {
      const filteredFIRs = mockFIRs.filter(fir => fir.reportedBy.id === user.id);
      setUserFIRs(filteredFIRs);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button asChild className="bg-fir-700 hover:bg-fir-800">
            <Link to="/file-fir">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              File New Voice FIR
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total FIRs</CardTitle>
            <CardDescription>All FIRs reported by you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{userFIRs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending</CardTitle>
            <CardDescription>FIRs awaiting action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userFIRs.filter(fir => fir.status === 'pending' || fir.status === 'reviewing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Resolved</CardTitle>
            <CardDescription>Completed or approved FIRs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userFIRs.filter(fir => fir.status === 'completed' || fir.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8">Recent FIRs</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {userFIRs.length > 0 ? (
          userFIRs.slice(0, 4).map((fir) => (
            <Card key={fir.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{fir.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(fir.status)}`}>
                    {fir.status.charAt(0).toUpperCase() + fir.status.slice(1)}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  Filed on {formatDate(fir.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">{fir.description}</p>
                
                {fir.assignedOfficer && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">Assigned to:</span>
                    <p className="text-sm font-medium">{fir.assignedOfficer}</p>
                  </div>
                )}
                
                {fir.updates && fir.updates.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">Latest update:</span>
                    <p className="text-sm mt-1">{fir.updates[fir.updates.length - 1].comment}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="text-fir-600" asChild>
                  <Link to={`/fir/${fir.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-dashed border-2 bg-gray-50">
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-gray-400"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                  <h3 className="text-lg font-medium text-gray-600">No FIRs Filed Yet</h3>
                  <p className="text-gray-500 max-w-sm">
                    You haven't filed any FIRs yet. Click the button below to file your first FIR.
                  </p>
                  <Button asChild className="bg-fir-700 hover:bg-fir-800">
                    <Link to="/file-fir">
                      File New FIR
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {userFIRs.length > 4 && (
          <div className="col-span-full flex justify-center mt-2">
            <Button variant="outline" asChild>
              <Link to="/my-firs">
                View All FIRs
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Help</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-fir-100 text-fir-600 flex items-center justify-center mr-2">1</span>
                <p className="text-sm">Use the <strong>File Voice FIR</strong> button to record your complaint</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-fir-100 text-fir-600 flex items-center justify-center mr-2">2</span>
                <p className="text-sm">Check <strong>My FIRs</strong> to view the status of all your reports</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-fir-100 text-fir-600 flex items-center justify-center mr-2">3</span>
                <p className="text-sm">For urgent assistance, contact the emergency helpline at <strong>100</strong></p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <div>
                  <p className="font-medium">Police Emergency</p>
                  <p className="text-sm text-gray-600">100</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <div>
                  <p className="font-medium">Women Helpline</p>
                  <p className="text-sm text-gray-600">1091</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <div>
                  <p className="font-medium">Child Helpline</p>
                  <p className="text-sm text-gray-600">1098</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
