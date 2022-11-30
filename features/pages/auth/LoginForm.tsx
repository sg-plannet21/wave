import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/Button';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Form<LoginValues, typeof schema>
        schema={schema}
        onSubmit={async ({ username, password }) => {
          setIsLoading(true);
          try {
            await signIn('credentials', {
              username,
              password,
              redirect: false,
            });
            setIsLoading(false);
            onSuccess();
          } catch (error) {
            setIsLoading(false);
            console.log('error :>> ', error);
          }
        }}
      >
        {({ register, formState }) => (
          <>
            <InputField
              registration={register('username')}
              label="Username"
              error={formState.errors['username']}
            />
            <InputField
              registration={register('password')}
              label="password"
              type="password"
              error={formState.errors['password']}
            />
            <div>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
                className="w-full"
              >
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default LoginForm;
