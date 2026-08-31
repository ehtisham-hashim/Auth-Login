import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Missing email or password');
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new ApiError(400, error.message);
  
  res.status(201).json(new ApiResponse(201, data, 'User created! Sweet!'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Missing email or password');
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new ApiError(401, 'Invalid login credentials');
  
  res.status(200).json(new ApiResponse(200, { access_token: data.session.access_token }, 'Login success! Sweet!'));
});

export const logout = asyncHandler(async (req, res) => {
  await supabase.auth.signOut();
  res.status(200).json(new ApiResponse(200, null, 'Logged out! Sweet!'));
});
