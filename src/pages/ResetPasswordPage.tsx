
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
});

const passwordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { resetPassword, updatePassword } = useAuth();
  const [isResetSent, setIsResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  
  // Check if we're resetting or requesting
  const isResetRequest = !searchParams.get('type');
  
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  
  const onResetRequest = async (data: z.infer<typeof resetSchema>) => {
    setIsResetting(true);
    try {
      await resetPassword(data.email);
      setIsResetSent(true);
    } finally {
      setIsResetting(false);
    }
  };
  
  const onPasswordUpdate = async (data: z.infer<typeof passwordSchema>) => {
    setIsResetting(true);
    try {
      await updatePassword(data.password);
      navigate('/login', { replace: true });
    } finally {
      setIsResetting(false);
    }
  };
  
  if (isResetSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent you a password reset link. Please check your email.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Back to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>
            {isResetRequest ? 'Reset your password' : 'Create new password'}
          </CardTitle>
          <CardDescription>
            {isResetRequest 
              ? 'Enter your email and we'll send you a link to reset your password' 
              : 'Please create a new strong password for your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResetRequest ? (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetRequest)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isResetting}
                >
                  {isResetting ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordUpdate)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isResetting}
                >
                  {isResetting ? 'Updating...' : 'Update password'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/login')}
            className="text-xs"
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
