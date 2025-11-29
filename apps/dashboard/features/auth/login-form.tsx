'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { toast } from 'sonner';

import { authClient } from '@workspace/auth/client';
import { Button } from '@workspace/ui/components/button';
import {
  Field,
  FieldGroup,
  FieldSeparator
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { redirect } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <FieldSeparator>Email</FieldSeparator>
        <Field>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await authClient.signIn.magicLink(
                {
                  email,
                  callbackURL: "/organizations"
                },
                {
                  onRequest() {
                    setLoading(true);
                  },
                  onError(ctx: { error: { message: string } }) {
                    toast.error(ctx.error.message);
                    setLoading(false);
                  },
                  onSuccess() {
                    // toast.success('Magic link sent!');
                    redirect('/magic');
                    setLoading(false);
                  }
                }
              );
            }}
          >
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              'Login'
            )}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full gap-2"
            onClick={async () => {
              await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/organizations'
              });
            }}
          >
            <FaGoogle />
            Login with Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full gap-2"
            onClick={async () => {
              await authClient.signIn.social({
                provider: 'microsoft',
                  callbackURL: "/organizations"
              });
            }}
          >
            <FaMicrosoft />
            Login with Microsoft
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
