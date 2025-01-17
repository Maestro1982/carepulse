'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import AppointmentForm from '@/components/forms/AppointmentForm';

import { Appointment } from '@/types/appwrite.types';

interface AppointmentModalProps {
  type: 'schedule' | 'cancel';
  patientId: string;
  userId: string;
  appointment?: Appointment;
}

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: AppointmentModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className={`capitalize ${
            type === 'schedule' && 'text-fuchsia-500'
          } hover:underline`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} an appointment.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
export default AppointmentModal;
