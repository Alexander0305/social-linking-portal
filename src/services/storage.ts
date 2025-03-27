
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Upload a file to storage
export const uploadFile = async (
  file: File, 
  bucket: string = 'media', 
  folder: string = 'uploads'
) => {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return { filePath, publicUrl, error: null };
  } catch (error) {
    return { filePath: null, publicUrl: null, error };
  }
};

// Delete a file from storage
export const deleteFile = async (
  filePath: string, 
  bucket: string = 'media'
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  
  return { data, error };
};

// Get a temporary URL for a file (expires after the specified seconds)
export const getTemporaryUrl = async (
  filePath: string, 
  bucket: string = 'media',
  expiresIn: number = 60 // seconds
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);
  
  return { data, error };
};

// List all files in a folder
export const listFiles = async (
  folder: string = 'uploads',
  bucket: string = 'media'
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder);
  
  return { data, error };
};
