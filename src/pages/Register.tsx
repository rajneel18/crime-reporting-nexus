
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please check and try again.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpSent(true);
    setLoading(false);
    
    toast({
      title: "OTP sent",
      description: `An OTP has been sent to your phone ${phone}. Please enter it to verify your account.`,
    });
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    
    toast({
      title: "Registration successful",
      description: "Your account has been created successfully. You can now login.",
    });
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-fir-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">FIR</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-fir-800">FIR Guardian</h1>
        <p className="text-gray-600 mt-2">Crime Reporting and Management System</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{otpSent ? 'Verify OTP' : 'Create an account'}</CardTitle>
          <CardDescription>
            {otpSent 
              ? 'Enter the OTP sent to your phone to verify your account'
              : 'Fill in the details below to create your account'
            }
          </CardDescription>
        </CardHeader>
        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-fir-700 hover:bg-fir-800"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a 
                  href="#" 
                  className="font-medium text-fir-600 hover:text-fir-700"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Login
                </a>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex space-x-2">
                  {[...Array(6)].map((_, index) => (
                    <Input 
                      key={index}
                      className="w-12 text-center"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.match(/^[0-9]$/) || value === '') {
                          const newOtp = otp.split('');
                          newOtp[index] = value;
                          setOtp(newOtp.join(''));
                          
                          // Auto-focus next input
                          if (value !== '' && index < 5) {
                            const nextInput = document.querySelector(`input:nth-of-type(${index + 2})`) as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      required
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Didn't receive the OTP?{" "}
                  <a 
                    href="#" 
                    className="font-medium text-fir-600 hover:text-fir-700"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "OTP resent",
                        description: "A new OTP has been sent to your phone.",
                      });
                    }}
                  >
                    Resend OTP
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-fir-700 hover:bg-fir-800"
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Register'
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                <a 
                  href="#" 
                  className="font-medium text-fir-600 hover:text-fir-700"
                  onClick={(e) => {
                    e.preventDefault();
                    setOtpSent(false);
                  }}
                >
                  Go back
                </a>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Register;
