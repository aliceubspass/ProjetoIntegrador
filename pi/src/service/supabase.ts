
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lksdbughdwfaigwfhdpl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrc2RidWdoZHdmYWlnd2ZoZHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDU4NjEsImV4cCI6MjA2OTg4MTg2MX0.7uvrpL3gWQp_L3IeeZWXinzfjJyq70xM4kU5xX25WII";

export const supabase = createClient(supabaseUrl, supabaseKey);
        