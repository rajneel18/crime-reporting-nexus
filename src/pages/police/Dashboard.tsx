
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockFIRs } from '@/utils/mockData';
import { useAuthStore } from '@/utils/auth';
import { FIR } from '@/types';

const PoliceDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    completed: 0,
    rejected: 0,
    approved: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  
  const [recentFIRs, setRecentFIRs] = useState<FIR[]>([]);
  
  useEffect(() => {
    // Calculate stats from mock data
    const totalCount = mockFIRs.length;
    const pendingCount = mockFIRs.filter(fir => fir.status === 'pending').length;
    const reviewingCount = mockFIRs.filter(fir => fir.status === 'reviewing').length;
    const completedCount = mockFIRs.filter(fir => fir.status === 'completed').length;
    const rejectedCount = mockFIRs.filter(fir => fir.status === 'rejected').length;
    const approvedCount = mockFIRs.filter(fir => fir.status === 'approved').length;
    
    const highPriorityCount = mockFIRs.filter(fir => fir.priority === 'high').length;
    const mediumPriorityCount = mockFIRs.filter(fir => fir.priority === 'medium').length;
    const lowPriorityCount = mockFIRs.filter(fir => fir.priority === 'low').length;
    
    setStats({
      total: totalCount,
      pending: pendingCount,
      reviewing: reviewingCount,
      completed: completedCount,
      rejected: rejectedCount,
      approved: approvedCount,
      high: highPriorityCount,
      medium: mediumPriorityCount,
      low: lowPriorityCount,
    });
    
    // Get recent FIRs
    const sorted = [...mockFIRs].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setRecentFIRs(sorted.slice(0, 5));
  }, []);

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
          <h1 className="text-3xl font-bold tracking-tight">Police Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button asChild className="bg-fir-700 hover:bg-fir-800">
            <Link to="/police/file-fir">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M12 8a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              File New Voice FIR
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/police/interrogation">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15V6m-4-3v18m-8-6v6m-4-9v9"/><circle cx="17" cy="3" r="1"/><circle cx="9" cy="9" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              Interrogation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total FIRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.pending + stats.reviewing}</div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="inline-block mr-2">New: {stats.pending}</span>
              <span>In Review: {stats.reviewing}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.completed + stats.approved}</div>
            <div className="text-xs text-gray-500 mt-1">
              <span className="inline-block mr-2">Approved: {stats.approved}</span>
              <span>Completed: {stats.completed}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.high}</div>
            <div className="text-xs text-gray-500 mt-1">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent FIRs</CardTitle>
            <CardDescription>
              Recently filed complaints requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Case ID</th>
                    <th className="text-left py-3 px-2 font-medium">Title</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-left py-3 px-2 font-medium">Status</th>
                    <th className="text-left py-3 px-2 font-medium">Priority</th>
                    <th className="text-right py-3 px-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentFIRs.map(fir => (
                    <tr key={fir.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{fir.id}</td>
                      <td className="py-3 px-2">{fir.title}</td>
                      <td className="py-3 px-2">{formatDate(fir.createdAt)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(fir.status)}`}>
                          {fir.status.charAt(0).toUpperCase() + fir.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {fir.priority === 'high' && <span className="text-red-500 font-medium">High</span>}
                        {fir.priority === 'medium' && <span className="text-yellow-500 font-medium">Medium</span>}
                        {fir.priority === 'low' && <span className="text-green-500 font-medium">Low</span>}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm" className="text-fir-600" asChild>
                          <Link to={`/police/fir/${fir.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/police/all-firs">
                  View All FIRs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>FIR Statistics</CardTitle>
            <CardDescription>
              Overview of FIR status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.pending / stats.total * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.pending / stats.total) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Reviewing</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.reviewing / stats.total * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.reviewing / stats.total) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Approved</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.approved / stats.total * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.approved / stats.total) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.completed / stats.total * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-700 h-2 rounded-full" style={{ width: `${(stats.completed / stats.total) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Rejected</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.rejected / stats.total * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.rejected / stats.total) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Priority: High</span>
                  <span className="text-sm text-gray-600">{stats.high}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Priority: Medium</span>
                  <span className="text-sm text-gray-600">{stats.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority: Low</span>
                  <span className="text-sm text-gray-600">{stats.low}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceDashboard;
