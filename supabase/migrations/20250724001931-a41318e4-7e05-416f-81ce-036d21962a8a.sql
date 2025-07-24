
-- Add RLS policy to allow employees to view their own appointments
CREATE POLICY "Employees can view their own appointments" 
ON appointments 
FOR SELECT 
USING (employee_id = auth.uid());

-- Add RLS policy to allow employees to update their own appointments
CREATE POLICY "Employees can update their own appointments" 
ON appointments 
FOR UPDATE 
USING (employee_id = auth.uid());
