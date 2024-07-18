'use server';

import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '@/lib/appwrite.config';
import { parseStringify, formatDateTime } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (accumulator, appointment) => {
        if (appointment.status === 'scheduled') {
          accumulator.scheduledCount += 1;
        } else if (appointment.status === 'pending') {
          accumulator.pendingCount += 1;
        } else if (appointment.status === 'cancelled') {
          accumulator.cancelledCount += 1;
        }

        return accumulator;
      },
      initialCounts
    );

    // Ensure the documents are typed as Appointment[]
    const formattedDocuments = (appointments.documents as Appointment[]).map(
      (appointment: Appointment) => ({
        ...appointment,
        schedule: new Date(appointment.schedule), // Ensure schedule is a Date object
        formattedSchedule: formatDateTime(appointment.schedule),
      })
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: formattedDocuments,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error('Appointment not found.');
    }

    revalidatePath('/admin');
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};
