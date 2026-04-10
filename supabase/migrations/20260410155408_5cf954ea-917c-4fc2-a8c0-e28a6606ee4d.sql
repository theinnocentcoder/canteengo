
DROP POLICY "Anyone authenticated can insert notifications" ON public.notifications;
CREATE POLICY "Authorized users can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = student_id OR public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin')
);
