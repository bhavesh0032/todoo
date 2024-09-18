// import { Request, Response } from 'express';
// import { supabase } from '../config/supabase';
// import { Task } from '../models/Task';

// // @ts-ignore
// export const getTasks = async (req: Request, res: Response) => {
//   try {
//     const { data, error } = await supabase.from('tasks').select('*');
//     if (error) throw error;
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching tasks' });
//   }
// };

// // @ts-ignore
// export const createTask = async (req: Request, res: Response) => {
//   try {
//     console.log('Request body:', req.body)
//     const { title, status }: Task = req.body
//     console.log('Attempting to create task:', { title, status });

//     if (!title || !status) {
//         console.error('Invalid input:', { title, status });
//         return res.status(400).json({ error: 'Title and status are required' });
//       }

//     const { data, error } = await supabase
//       .from('tasks')
//       .insert({ title, status })
//       .single();

//       if (error) {
//         console.error('Supabase error:', error);
//         return res.status(500).json({ error: 'Error creating task', details: error.message, code: error.code });
//       }

//       if (!data) {
//         console.warn('Task created but no data returned');
//         // @ts-ignore
//         const { data: checkData, error: checkError } = await supabase
//           .from('tasks')
//           .select('*')
//           .eq('title', title)
//           .eq('status', status)
//           .single();

//     console.log('Task created successfully:', data);
//     res.status(201).json(data);
//   } catch (error) {
//     console.error('Unexpected error in createTask:', error);
    
//     res.status(500).json({ error: 'Unexpected error creating task', details: error.message })
//   }
// };

// export const updateTask = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, status }: Task = req.body;
//     const { data, error } = await supabase.from('tasks').update({ title, status }).eq('id', id).single();
//     if (error) throw error;
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating task' });
//   }
// };

// export const deleteTask = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { error } = await supabase.from('tasks').delete().eq('id', id);
//     if (error) throw error;
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting task' });
//   }
// };

import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Task } from '../models/Task';

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request body:', req.body);
        const { title, status }: Task = req.body;
        console.log('Attempting to create task:', { title, status });
        
        if (!title || !status) {
          console.error('Invalid input:', { title, status });
          res.status(400).json({ error: 'Title and status are required' });
          return;
        }
    
        const { data, error } = await supabase
          .from('tasks')
          .insert({ title, status })
          .select()
          .single();
    
        if (error) {
          console.error('Supabase error:', error);
          res.status(500).json({ error: 'Error creating task', details: error.message, code: error.code });
          return;
        }
    
        if (!data) {
          console.warn('Task created but no data returned');
          const { data: checkData, error: checkError } = await supabase
            .from('tasks')
            .select('*')
            .eq('title', title)
            .eq('status', status)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (checkError) {
            console.error('Error checking for created task:', checkError);
            res.status(500).json({ error: 'Error verifying task creation', details: checkError.message });
            return;
          }
    
          if (checkData && checkData.length > 0) {
            console.log('Task found after creation:', checkData[0]);
            res.status(201).json(checkData[0]);
            return;
          } else {
            console.error('Task not found after apparent successful creation');
            res.status(500).json({ error: 'Task creation could not be verified' });
            return;
          }
        }
    
        console.log('Task created successfully:', data);
        res.status(201).json(data);
      } catch (error) {
        console.error('Unexpected error in createTask:', error);
        res.status(500).json({ error: 'Unexpected error creating task', details: error instanceof Error ? error.message : 'Unknown error' });
      }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, status }: Task = req.body;

    console.log(`Attempting to update task with id: ${id}`, { title, status })
    
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

      if (checkError) {
        console.error('Error checking for existing task:', checkError);
        res.status(500).json({ error: 'Error checking for existing task', details: checkError.message });
        return;
      }
      if (!existingTask) {
        console.log(`Task with id ${id} not found`);
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      const { data, error } = await supabase
      .from('tasks')
      .update({ title, status })
      .eq('id', id)
      .select()
      .single();

      if (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task', details: error.message });
        return;
      }
  
      if (!data) {
        console.error('Update successful but no data returned');
        res.status(500).json({ error: 'Update successful but no data returned' });
        return;
      }
  
      console.log('Task updated successfully:', data);
      res.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error in updateTask:', error);
    res.status(500).json({ error: 'Unexpected error updating task', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Error deleting task', details: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Unexpected error in deleteTask:', error);
    res.status(500).json({ error: 'Unexpected error deleting task', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Error fetching tasks', details: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Unexpected error in getTasks:', error);
    res.status(500).json({ error: 'Unexpected error fetching tasks', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};