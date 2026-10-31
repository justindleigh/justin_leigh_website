-- Three columns for the contact form, added 2026-10-31.
--
-- Justin: "it's missing fields for people to enter case numbers opposing
-- counsel opposing party info I also want a field that asks if they have
-- docs to share if so then I will provide them w a secured link to a portal
-- to upload."
--
-- opposing_party already existed. These three did not:
--
--   case_number       the cause number on its own, because the existing
--                     "case details" box invites a sentence where the file
--                     wants 25-2-00026-20
--   opposing_counsel  the other side's lawyer, kept separate from the
--                     existing other_attorney question, which asks about
--                     THEIR own lawyer. One box could not mean both: for a
--                     conflict check those are opposite facts
--   has_documents     drives the secure upload link. A non-empty answer that
--                     does not start with "n" marks the notification subject
--                     [DOCS]
--
-- Safe to run twice. Adds nothing if the columns are already there, and
-- touches no existing row or value.

alter table public.contact_submissions
  add column if not exists case_number      text,
  add column if not exists opposing_counsel text,
  add column if not exists has_documents    text;
