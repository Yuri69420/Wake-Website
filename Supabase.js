
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lnhemxbqdjwjvfnklyaf.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaGVteGJxZGp3anZmbmtseWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MDg5NzgsImV4cCI6MjAzMjQ4NDk3OH0.rwVxGfBwtJFf1ZgaquBY2fNKU_5gSbRZY-Am8Fj9bv4"
const supabase = createClient(supabaseUrl, supabaseKey)
