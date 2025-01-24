import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useSignInMutation } from '@/redux/services/auth.service';
import { toast } from '@/hooks/use-toast';
import { setLoggedIn } from '@/redux/features/app-state-slice';
import { useDispatch } from 'react-redux';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading }] = useSignInMutation();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await loginUser({ email: formData.email, password: formData.password });
    const { data, error } = result;
    if (!error) {
      const { message, user } = data;
      toast({
        title: `${message} ${user.username}`,
      });
      dispatch(setLoggedIn(user));
      await router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to login.',
        description: `${error?.data?.error}`,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side illustration */}
      <div className="hidden lg:flex w-1/2 bg-primary-50 items-center justify-center">
        <div className="max-w-md p-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Welcome Back</h2>
          <p className="text-muted-foreground">
            Log in to your account to manage your mining operations and track your earnings in real-time.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center px-8 py-10">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Login to Your Account</h1>
            {router.query.registered && (
              <p className="text-sm text-green-600 mt-2">
                Registration successful! Please log in with your credentials.
              </p>
            )}
            <p className="text-muted-foreground mt-2">Welcome back to TretaMiner</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 