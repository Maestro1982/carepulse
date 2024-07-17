'use client';

import Image from 'next/image';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';

import CustomFormfield from '@/components/CustomFormField';
import SubmitButton from '@/components/SubmitButton';
import { FormFieldType } from '@/components/forms/PatientForm';

import { getAppointmentSchema } from '@/lib/validation';
import { Doctors } from '@/constants';
import { Appointment } from '@/types/appwrite.types';
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.actions';

type AppointmentFormProps = {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
};

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : '',
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;

    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {}
  };

  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
        {type === 'create' && (
          <section className='mb-12 space-y-4'>
            <h1 className='header'>New Appointment 📅</h1>
            <p className='text-dark-700'>
              Request a new appointment in less then 60 seconds.
            </p>
          </section>
        )}

        {type !== 'cancel' && (
          <>
            <CustomFormfield
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name='primaryPhysician'
              label='Doctor'
              placeholder='Select a doctor'
            >
              {Doctors.map((doctor) => (
                <div
                  key={doctor.name}
                  className='w-full hover:bg-fuchsia-500 rounded-md'
                >
                  <SelectItem value={doctor.name}>
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
                          <span className='mr-2'>-</span>{' '}
                          {doctor.specialization}
                        </span>
                      </p>
                    </div>
                  </SelectItem>
                </div>
              ))}
            </CustomFormfield>

            <CustomFormfield
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label='Expected appointment date'
              showTimeSelect
              dateFormat='dd/MM/yyyy HH:mm aa'
            />

            <div className='flex flex-col gap-6 xl:flex-row'>
              <CustomFormfield
                fieldType={FormFieldType.TEXT_AREA}
                control={form.control}
                name='reason'
                label='Reason for appointment'
                placeholder='ex: Annual monthly check-up'
              />

              <CustomFormfield
                fieldType={FormFieldType.TEXT_AREA}
                control={form.control}
                name='note'
                label='Note'
                placeholder='ex: Daily blood pressure recording, the value is to high'
              />
            </div>
          </>
        )}

        {type === 'cancel' && (
          <CustomFormfield
            fieldType={FormFieldType.TEXT_AREA}
            control={form.control}
            name='cancellationReason'
            label='Reason for cancellation'
            placeholder='Enter reason for cancellation'
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
export default AppointmentForm;
