'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import StatusBadge from '@/components/StatusBadge';
import AppointmentModal from '@/components/AppointmentModal';

import { Doctors } from '@/constants';
import { Appointment } from '@/types/appwrite.types';

export const columns: ColumnDef<Appointment>[] = [
  {
    header: '#',
    cell: ({ row }) => {
      return <p className='text-14-medium '>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className='text-14-medium '>{appointment.patient.name}</p>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className='min-w-[115px]'>
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: 'schedule',
    header: 'Appointment',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className='text-14-regular min-w-[100px]'>
          {appointment.formattedSchedule?.dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Doctor',
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className='flex items-center gap-3'>
          <Image
            src={doctor?.image!}
            alt='doctor'
            width={100}
            height={100}
            className='size-8'
          />
          <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: 'Specialization',
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );
      return (
        <p className='text-14-regular min-w-[100px]'>
          {doctor?.specialization}
        </p>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className='pl-4'>Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className='flex gap-1'>
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type='schedule'
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type='cancel'
          />
        </div>
      );
    },
  },
];
