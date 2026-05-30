import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hcdxvvhhpfrycjrasgym.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZHh2dmhocGZyeWNqcmFzZ3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjEwMzIsImV4cCI6MjA5NTM5NzAzMn0.sMxVOD3dRKXaZBlENaj10cW1FwM8B_kDMSWmHVDF394"

export const supabase = createClient(supabaseUrl, supabaseKey)
