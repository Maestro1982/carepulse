import Image from 'next/image';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

import { getAppointment } from '@/lib/actions/appointment.actions';
import { Doctors } from '@/constants';
import { formatDateTime } from '@/lib/utils';
import { getUser } from '@/lib/actions/patient.actions';

import { Button } from '@/components/ui/button';

const SuccessPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const user = await getUser(userId);
  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  Sentry.metrics.set('user_view_appointment-success', user.name);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
          <Image
            src='/assets/icons/logo-full.svg'
            alt='logo'
            height={1000}
            width={1000}
            className='h-10 w-fit'
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image
            src='/assets/gifs/success.gif'
            alt='success'
            height={300}
            width={280}
            unoptimized
          />

          <h2 className='header mb-6 max-w-[600px] text-center'>
            Your <span className='text-fuchsia-500'>appointment request</span>{' '}
            has been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className='request-details'>
          <p>Requested appointment details:</p>
          <div className='flex items-center gap-3'>
            <Image
              src={doctor?.image!}
              alt='doctor'
              height={100}
              width={100}
              className='size-6'
            />
            <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
            <p className='whitespace-nowrap'>
              Specialization: {doctor?.specialization}
            </p>
          </div>
          <div className='flex gap-2'>
            <Image
              src='/assets/icons/calendar.svg'
              alt='calendar'
              height={24}
              width={24}
            />
            <p className='text-fuchsia-400'>
              {formatDateTime(appointment.schedule).dateTime}
            </p>
          </div>
        </section>

        <Button variant='outline' className='shad-primary-btn' asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className='copyright'>&copy; {new Date().getFullYear()} CarePulse</p>
      </div>
    </div>
  );
};
export default SuccessPage;
