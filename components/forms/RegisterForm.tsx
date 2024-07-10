'use client';

import Image from 'next/image';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

import { Form, FormControl } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';

import CustomFormfield from '@/components/CustomFormField';
import SubmitButton from '@/components/SubmitButton';
import { FormFieldType } from '@/components/forms/PatientForm';
import FileUploader from '@/components/FileUploader';

import { UserFormValidation } from '@/lib/validation';
import { createUser } from '@/lib/actions/patient.actions';
import { Doctors, GenderOptions, IdentificationTypes } from '@/constants';

const RegisterForm = ({ user }: { user: User }) => {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-12 flex-1'
      >
        <section className='space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>Let us know more about yourself.</p>
        </section>
        <section className='space-y-4'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal Information</h2>
          </div>
        </section>
        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='name'
          label='Fullname'
          placeholder='ex: John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='email'
            label='Email address'
            placeholder='ex: johndoe@gmail.com'
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
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name='birthDate'
            label='Date of birth'
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name='gender'
            label='Gender'
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className='flex h-11 gap-6 xl:justify-between'
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className='radio-group'>
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className='cursor-pointer'>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='address'
            label='Address'
            placeholder='ex: Passtraat 14, 9100 Sint-Niklaas'
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='occupation'
            label='Occupation'
            placeholder='ex: Software Developer'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='emergencyContactName'
            label='Emergency contact name'
            placeholder="Guardian's name"
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name='emergencyContactNumber'
            label='Emergency contact number'
            placeholder='Enter digits between 9 and 15...'
          />
        </div>

        <section className='space-y-4'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Medical Information</h2>
          </div>
        </section>

        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name='primaryPhysician'
          label='Primary care physician'
          placeholder='Select a physician'
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className='flex items-center cursor-pointer gap-2'>
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className='rounded-full border border-dark-500'
                />
                <p>
                  {doctor.name}
                  <span className='ml-2'>
                    {' '}
                    <span className='mr-2'>-</span> {doctor.specialization}
                  </span>
                </p>
              </div>
            </SelectItem>
          ))}
        </CustomFormfield>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='insuranceProvider'
            label='Insurance provider'
            placeholder='ex: DKV'
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='insurancePolicyNumber'
            label='Insurance policy number'
            placeholder='ex: ABC123456789'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.TEXT_AREA}
            name='allergies'
            label='Allergies (if any)'
            placeholder='ex: Peanuts, Penicillin, Pollen'
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.TEXT_AREA}
            name='currentMedication'
            label='Current medication (if any)'
            placeholder='ex: Ibuprofen 200mg, Paracetamol 500mg'
          />
        </div>

        <div className='flex flex-col gap-6 xl:flex-row'>
          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.TEXT_AREA}
            name='familyMedicalHistory'
            label='Family medical history (if any)'
            placeholder='ex: Mother had brain cancer, father had a heart disease'
          />

          <CustomFormfield
            control={form.control}
            fieldType={FormFieldType.TEXT_AREA}
            name='pastMedicalHistory'
            label='Past medical history (if any)'
            placeholder='ex: Appendectomy, Tonsillectomy'
          />
        </div>

        <section className='space-y-4'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Identification and Verification</h2>
          </div>
        </section>

        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name='identificationType'
          label='Identification type'
          placeholder='Select an identification type'
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormfield>

        <CustomFormfield
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='identificationNumber'
          label='Identification number'
          placeholder='ex: 123456789'
        />

        <CustomFormfield
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name='identificationDocument'
          label='Scanned copy of identification document'
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className='space-y-4'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormfield
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='treatmentConsent'
          label='I consent to receive treatment for my health condition.'
        />

        <CustomFormfield
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='disclosureConsent'
          label='I consent to the use and disclosure of my health information for treatment purposes.'
        />

        <CustomFormfield
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name='privacyConsent'
          label='I acknowledge that I have reviewed and agree to the privacy policy.'
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
