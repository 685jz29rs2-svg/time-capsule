-- Allow pending_payment for live Stripe (seal only on webhook)
alter table public.capsules drop constraint if exists capsules_status_check;
alter table public.capsules
  add constraint capsules_status_check
  check (status in ('draft', 'pending_payment', 'sealed', 'delivered'));
