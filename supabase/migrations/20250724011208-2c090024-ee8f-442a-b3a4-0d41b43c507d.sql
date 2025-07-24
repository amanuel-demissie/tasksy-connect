
-- Fix the RLS policy for employee_services to include WITH CHECK clause
DROP POLICY IF EXISTS "Business owners can manage employee services" ON employee_services;

CREATE POLICY "Business owners can manage employee services" 
ON employee_services 
FOR ALL 
USING (
  EXISTS (
    SELECT 1
    FROM employees e
    JOIN business_profiles bp ON e.business_id = bp.id
    WHERE e.id = employee_services.employee_id 
    AND bp.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM employees e
    JOIN business_profiles bp ON e.business_id = bp.id
    WHERE e.id = employee_services.employee_id 
    AND bp.owner_id = auth.uid()
  )
);
