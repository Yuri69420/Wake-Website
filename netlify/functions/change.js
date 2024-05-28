require('dotenv').config();

DATABASE_URL = "https://lnhemxbqdjwjvfnklyaf.supabase.co";
SUPABASE_SERVICE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaGVteGJxZGp3anZmbmtseWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MDg5NzgsImV4cCI6MjAzMjQ4NDk3OH0.rwVxGfBwtJFf1ZgaquBY2fNKU_5gSbRZY-Am8Fj9bv4";


// Connect to our database 
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// Our standard serverless handler function
exports.handler = async event => {

  // Insert a row
    const { data, error } = await supabase
        .from('notes')
        .insert([
            { note: 'I need to not forget this' },
        ]);

  // Did it work?
  console.log(data, error);
  
}