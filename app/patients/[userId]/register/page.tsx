import Image from 'next/image';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

import RegisterForm from '@/components/forms/RegisterForm';

import { getUser } from '@/lib/actions/patient.actions';

const UserRegistrationPage = async ({
  params: { userId },
}: SearchParamProps) => {
  const user = await getUser(userId);

  Sentry.metrics.set('user_view_register', user.name);

  return (
    <div className='flex h-screen max-h-screen'>
      <section className='remove-scrollbar container'>
        <div className='sub-container max-w-[860px] flex-1 flex-col py-10'>
          <Link href='/'>
            <Image
              src='/assets/icons/logo-full.svg'
              alt='logo'
              height={1000}
              width={1000}
              className='mb-12 h-10 w-fit'
            />
          </Link>

          <RegisterForm user={user} />

          <p className='copyright py-12'>
            &copy; {new Date().getFullYear()} CarePulse
          </p>
        </div>
      </section>

      <Image
        src='/assets/images/register-img.png'
        alt='doctors'
        width={1000}
        height={1000}
        className='side-img max-w-[390px]'
      />
    </div>
  );
};
export default UserRegistrationPage;
