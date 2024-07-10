'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import CustomFormfield from '@/components/CustomFormField';
import SubmitButton from '@/components/SubmitButton';

import { UserFormValidation } from '@/lib/validation';
import { createUser } from '@/lib/actions/patient.actions';

export enum FormFieldType {
  INPUT = 'input',
  TEXT_AREA = 'textarea',
  PHONE_INPUT = 'phone-input',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'date-picker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (user && user.$id) {
        setIsLoading(false);
        router.push(`/patients/${user.$id}/register`);
      } else {
        console.error('Invalid user data:', user);
        toast.error('Failed to create user. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error creating user:', error);
      toast.error(`Error creating user: ${error.message || error}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        <section className='mb-12 space-y-4'>
          <h1 className='header'>Hi there 👋</h1>
          <p className='text-dark-700'>Schedule your first appointment.</p>
        </section>
        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='name'
          label='Fullname'
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />

        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='email'
          label='Email address'
          placeholder='johndoe@gmail.com'
          iconSrc='/assets/icons/email.svg'
          iconAlt='email'
        />

        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name='phone'
          label='Phonenumber'
          placeholder='Enter digits between 9 and 15...'
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
