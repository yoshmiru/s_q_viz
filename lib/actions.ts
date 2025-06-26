'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Transaction } from '@/lib/models/transaction';

export async function createTransaction(transaction: Transaction) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction]);

    if (error) {
      console.error('Error inserting data:', error);
      throw new Error('Failed to create transaction.');
    }
    revalidatePath('/protected'); // Revalidate the dashboard route
    return { success: true };
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return { success: false, message: '予期せぬエラーが発生しました。' };
  }
}

// create profile if it doesn't exist
export async function createProfileIfNotExists(userId: string, displayName: string) {
  const supabase = await createClient();
  console.log('Creating profile for user:', userId, 'with display name:', displayName);
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    if (!profileData) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          display_name: displayName,
          location: 'Unknown', // Default location
          created_at: new Date().toISOString(),
        }])
        .single();

      if (insertError) {
        throw insertError;
      } else {
        console.log('Profile created successfully for user:', userId);
      }
    } else {
      // Profile already exists, no action needed
      console.log('Profile already exists for user:', userId);
    }
  } catch (error) {
    console.error('An unexpected error occurred while creating profile:', error);
  }
}
